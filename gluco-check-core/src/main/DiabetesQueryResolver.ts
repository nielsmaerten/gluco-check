import DiabetesQuery from '../types/DiabetesQuery';
import AssistantResponse from '../types/AssistantResponse';
import ResponseFormatter from './ResponseFormatter';
import {ErrorTypes} from '../types/ErrorTypes';
import DiabetesSnapshot from '../types/DiabetesSnapshot';
import NightscoutClient from './clients/NightscoutClient';
import {injectable} from 'inversify';

@injectable()
export default class DiabetesQueryResolver {
  constructor(private responseFormatter: ResponseFormatter) {}
  resolve(query: DiabetesQuery): AssistantResponse {
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
