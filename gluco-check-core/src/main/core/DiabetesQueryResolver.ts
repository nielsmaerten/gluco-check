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
    let snapshot = new DiabetesSnapshot(Date.now());
    const nsClient = new NightscoutClient(query.user.nightscout);

    // Query each requested pointer and merge into snapshot
    query.pointers.forEach(async pointer => {
      const value = await nsClient.getPointer(pointer);
      snapshot = {...value, ...snapshot};
    });

    return this.responseFormatter.formatSnapshot(snapshot, query);
  }
}
