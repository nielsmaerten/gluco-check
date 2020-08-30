import dQuery from '../../types/DiabetesQuery';
import dSnapshot from '../../types/DiabetesSnapshot';
import aResponse from '../../types/AssistantResponse';
import {ErrorTypes} from '../../types/ErrorTypes';
import {injectable} from 'inversify';

@injectable()
export default class ResponseFormatter {
  constructor() {}

  public formatError(errorType: ErrorTypes, query: dQuery): aResponse {
    // TODO
    return new aResponse(errorType, Date.now(), query.locale);
  }

  public formatSnapshot(snapshot: dSnapshot, query: dQuery): aResponse {
    const {glucoseTrend, timestamp, glucoseValue} = snapshot;
    // TODO
    return new aResponse(
      `${glucoseValue()} and ${glucoseTrend} as of ${timestamp}`,
      Date.now(),
      query.locale
    );
  }
}
