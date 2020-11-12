import DiabetesQuery from '../../types/DiabetesQuery';
import AssistantResponse from '../../types/AssistantResponse';
import {ErrorTypes} from '../../types/ErrorTypes';
import DiabetesSnapshot from '../../types/DiabetesSnapshot';
import NightscoutClient from '../clients/nightscout/NightscoutClient';
import {injectable} from 'inversify';
import ResponseFormatter from './ResponseFormatter';
import {logger} from 'firebase-functions';
import {performance} from 'perf_hooks';

/**
 * DiabetesQuery resolver accepts a DiabetesSnapshot and turns it into an AssistantResponse.
 * It is responsible for getting the data for each Pointer in the Query by calling Clients
 */
@injectable()
// TODO(architecture): Split this class up.
// I'm thinking a queryFulfiller(?) that returns a DiabetesSnapshot, and then have the responseFormatter
// handle everything that concerns turning that snapshot into something the assistant can say
export default class DiabetesQueryResolver {
  constructor(private responseFormatter: ResponseFormatter) {}

  async resolve(query: DiabetesQuery): Promise<AssistantResponse> {
    // Ensure user exists and has a Nightscout Site
    if (!query.user.exists || !query.user.nightscout) {
      return this.responseFormatter.buildErrorResponse(
        ErrorTypes.Firebase_UserNotFound,
        query
      );
    }

    // Set up a new Snapshot. This is where we'll add the queried pointers to
    const mainSnapshot = new DiabetesSnapshot(Date.now(), query);
    mainSnapshot.glucoseUnit = query.user.glucoseUnit;

    // Create a Nightscout Client we can use for querying
    const nsClient = new NightscoutClient(query.user.nightscout);

    // Query Nightscout for each requested pointer
    const queryStart = performance.now();
    const snapshotParts = await Promise.all(
      query.pointers.map(p => nsClient.getPointer(p) as Partial<DiabetesSnapshot>)
    );
    const totalQueryTime = Math.floor(performance.now() - queryStart);
    logger.info(`[DiabetesQueryResolver]: Nightscout queries took ${totalQueryTime} ms.`);

    // Add all partial snapshots into the main snapshot
    mainSnapshot.update(...snapshotParts);

    // TODO(architecture): Split the class up around here

    // Check for common failures
    const nightscoutUnauthorized = mainSnapshot.errors.some(
      e => e.type === ErrorTypes.Nightscout_Unauthorized
    );
    const nightscoutUnavailable = mainSnapshot.errors.some(
      e => e.type === ErrorTypes.Nightscout_Unavailable
    );

    if (nightscoutUnauthorized) {
      return this.responseFormatter.buildErrorResponse(
        ErrorTypes.Nightscout_Unauthorized,
        query
      );
    } else if (nightscoutUnavailable) {
      return this.responseFormatter.buildErrorResponse(
        ErrorTypes.Nightscout_Unavailable,
        query
      );
    }

    // If Nightscout queries succeeded, carry on creating a regular response
    logger.info('[DiabetesQueryResolver]: Building response from', mainSnapshot);
    return this.responseFormatter.buildResponse(mainSnapshot, query);
  }
}
