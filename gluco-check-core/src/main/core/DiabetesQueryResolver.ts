import DmQuery from '../../types/DmQuery';
import AssistantResponse from '../../types/AssistantResponse';
import {ErrorType} from '../../types/ErrorType';
import DmSnapshot from '../../types/DmSnapshot';
import NightscoutClient from '../clients/nightscout/NightscoutClient';
import {injectable} from 'inversify';
import ResponseFormatter from './ResponseFormatter';
import {logger} from 'firebase-functions';
import {performance} from 'perf_hooks';

/**
 * DiabetesQuery resolver accepts a DmSnapshot and turns it into an AssistantResponse.
 * It is responsible for getting the data for each dmMetric in the Query by calling Clients
 * TODO(architecture): Split this class up.
 * I'm thinking a queryFulfiller(?) that returns a DiabetesSnapshot, and then have the responseFormatter
 * handle everything that concerns turning that snapshot into something the assistant can say
 */
@injectable()
export default class DiabetesQueryResolver {
  constructor(private responseFormatter: ResponseFormatter) {}

  async resolve(query: DmQuery): Promise<AssistantResponse> {
    // Ensure user exists and has a Nightscout Site
    if (!query.user.exists || !query.user.nightscout) {
      return this.responseFormatter.buildErrorResponse(
        ErrorType.Firebase_UserNotFound,
        query
      );
    }

    // Set up a new DmSnapshot. This is where we'll add the queried metrics to
    const newSnapshot = new DmSnapshot(Date.now(), query);
    newSnapshot.glucoseUnit = query.user.glucoseUnit;

    // Create a Nightscout Client we can use for querying
    const nsClient = new NightscoutClient(query.user.nightscout);

    // Query Nightscout for each requested metric
    const queryStart = performance.now();
    const partialSnapshots = await Promise.all(
      query.metrics.map(p => nsClient.getMetric(p) as Partial<DmSnapshot>)
    );
    const totalQueryTime = Math.floor(performance.now() - queryStart);
    logger.info(`[DiabetesQueryResolver]: Nightscout queries took ${totalQueryTime} ms.`);

    // Add all partial snapshots into the main snapshot
    newSnapshot.update(...partialSnapshots);

    // TODO(architecture): Split the class up around here

    // Check for common failures
    const nightscoutUnauthorized = newSnapshot.errors.some(
      e => e.type === ErrorType.Nightscout_Unauthorized
    );
    const nightscoutUnavailable = newSnapshot.errors.some(
      e => e.type === ErrorType.Nightscout_Unavailable
    );

    if (nightscoutUnauthorized) {
      return this.responseFormatter.buildErrorResponse(
        ErrorType.Nightscout_Unauthorized,
        query
      );
    } else if (nightscoutUnavailable) {
      return this.responseFormatter.buildErrorResponse(
        ErrorType.Nightscout_Unavailable,
        query
      );
    }

    // If Nightscout queries succeeded, carry on creating a regular response
    logger.info('[DiabetesQueryResolver]: Building response from', newSnapshot);
    return this.responseFormatter.buildResponse(newSnapshot, query);
  }
}
