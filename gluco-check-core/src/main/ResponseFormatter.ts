import dQuery from '../types/DiabetesQuery';
import dSnapshot from '../types/DiabetesSnapshot';
import aResponse from '../types/AssistantResponse';
import {ErrorTypes} from '../types/ErrorTypes';

// TODO: next
export default abstract class ResponseFormatter {
  public static formatError(errorType: ErrorTypes, query: dQuery): aResponse {
    return new aResponse('Something went wrong.', Date.now(), query.locale);
  }

  public static formatSnapshot(snapshot: dSnapshot, query: dQuery): aResponse {
    const {glucoseTrend, timestamp, glucoseValue} = snapshot;
    return new aResponse(
      `${glucoseValue()} and ${glucoseTrend} as of ${timestamp}`,
      Date.now(),
      query.locale
    );
  }
}
