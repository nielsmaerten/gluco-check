import {injectable} from 'inversify';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import {ErrorTypes} from '../../types/ErrorTypes';
import {GlucoseTrend} from '../../types/GlucoseTrend';
import DiabetesSnapshot from '../../types/DiabetesSnapshot';
import DiabetesQuery from '../../types/DiabetesQuery';
import AssistantResponse from '../../types/AssistantResponse';

@injectable()
export default class ResponseFormatter {
  constructor() {}

  public formatError(errorType: ErrorTypes, query: DiabetesQuery): AssistantResponse {
    // TODO
    return new AssistantResponse(errorType, query.locale);
  }

  public async formatSnapshot(
    snapshot: DiabetesSnapshot,
    query: DiabetesQuery,
    locale: string
  ): Promise<AssistantResponse> {
    const timeAgo = this.humanizeTime(snapshot.timestamp, locale);

    if (query.pointers.length === 1) {
      // 120 and stable as of 3 minutes ago.
    } else {
      // As of 2 minutes ago,
      // blood sugar is 120 and stable.
      // IOB is 23.
      // and
      // there are 12 carbs on board.
    }

    return new AssistantResponse("TODO", locale);
  }

  /**
   * Formats a relative timestamp to 'a few seconds', 'a minute', '3 minutes', etc.
   */
  private async humanizeTime(timestamp: number, locale: string) {
    await import(`dayjs/locale/${locale}`);
    return dayjs(timestamp).locale(locale).fromNow(true);
  }

  private formatBloodSugar(snapshot: DiabetesSnapshot) {
    if (snapshot.glucoseTrend !== GlucoseTrend.Unknown) {
      return '120 and stable';
    } else return snapshot.glucoseValue();
  }

  private formatCarbsOnBoard(cob: number) {}
}
