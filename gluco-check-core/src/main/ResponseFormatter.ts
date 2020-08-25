/* eslint-disable */ // TODO: remove this
import dQuery from '../types/DiabetesQuery';
import dSnapshot from '../types/DiabetesSnapshot';
import aResponse from '../types/AssistantResponse';

export default abstract class ResponseFormatter {
  public static formatError(errorType: any, query: dQuery): aResponse {
    // TODO (after NightscoutClient)
    return new aResponse('', 0, '');
  }

  public static formatSnapshot(snapshot: dSnapshot, query: dQuery): aResponse {
    // TODO (after NightscoutClient)
    return new aResponse('', 0, '');
  }
}
