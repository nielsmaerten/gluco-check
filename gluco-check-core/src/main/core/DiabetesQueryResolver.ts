import DiabetesQuery from '../../types/DiabetesQuery';
import AssistantResponse from '../../types/AssistantResponse';
import {ErrorTypes} from '../../types/ErrorTypes';
import DiabetesSnapshot from '../../types/DiabetesSnapshot';
import NightscoutClient from '../clients/NightscoutClient';
import {injectable} from 'inversify';
import ResponseFormatter from './ResponseFormatter';

/**
 * DiabetesQuery resolver accepts a DiabetesSnapshot and turns it into an AssistantResponse.
 * It is responsible for getting the data for each Pointer in the Query by calling Clients
 */
@injectable()
export default class DiabetesQueryResolver {
  constructor(private responseFormatter: ResponseFormatter) {}

  async resolve(query: DiabetesQuery): Promise<AssistantResponse> {
    // Ensure user exists and has a Nightscout Site
    if (!query.user.exists || !query.user.nightscout) {
      return this.responseFormatter.formatError(ErrorTypes.UserNotFound, query);
    }

    // Build a new snapshot and Client
    const snapshot = new DiabetesSnapshot(Date.now());
    snapshot.glucoseUnit = query.user.glucoseUnit;
    const nsClient = new NightscoutClient(query.user.nightscout);

    // Query each requested pointer and merge into snapshot
    const snapshotParts = await Promise.all(
      query.pointers.map(p => nsClient.getPointer(p))
    );
    snapshotParts.forEach(part => {
      Object.assign(snapshot, part);
    });

    return this.responseFormatter.formatSnapshot(snapshot, query);
  }
}
