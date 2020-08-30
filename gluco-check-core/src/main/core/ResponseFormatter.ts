import dQuery from '../../types/DiabetesQuery';
import dSnapshot from '../../types/DiabetesSnapshot';
import aResponse from '../../types/AssistantResponse';
import {ErrorTypes} from '../../types/ErrorTypes';
import {injectable} from 'inversify';
import {formatDistanceToNow} from 'date-fns';

@injectable()
export default class ResponseFormatter {
  constructor() {}

  public formatError(errorType: ErrorTypes, query: dQuery): aResponse {
    // TODO
    return new aResponse(errorType, Date.now(), query.locale);
  }

  public async formatSnapshot(snapshot: dSnapshot, locale: string): Promise<aResponse> {
    // const {
    //   glucoseTrend,
    //   timestamp,
    //   cannulaInserted,
    //   carbsOnBoard,
    //   insulinOnBoard,
    //   sensorInserted,
    // } = snapshot;
    // const glucoseValue = snapshot.glucoseValue();
    // const timeDiff = await this.humanizeTimestamp(timestamp, query.locale);

    // let SSML = '';

    // if (glucoseValue) {
    //   SSML += `${glucoseValue} and ${glucoseTrend} as of ${timeDiff}`;
    // }

    return new aResponse('102 and stable as of a few seconds ago.', Date.now(), locale);
  }

  private async humanizeTimestamp(timestamp: number, localeId: string) {
    const locale = await import(`date-fns/locale/${localeId}`);

    const s = formatDistanceToNow(timestamp, {
      locale,
    });
    return s;
  }
}
