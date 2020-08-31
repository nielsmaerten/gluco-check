import {injectable} from 'inversify';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import {ErrorTypes} from '../../types/ErrorTypes';
import i18n from '../i18n';
import DiabetesSnapshot from '../../types/DiabetesSnapshot';
import DiabetesQuery from '../../types/DiabetesQuery';
import AssistantResponse from '../../types/AssistantResponse';
import {DiabetesPointer} from '../../types/DiabetesPointer';
import FormatParams from '../../types/FormatParams';
import {
  formatCarbsOnBoard,
  formatBloodSugar,
  formatCannulaAge,
  formatInsulinOnBoard,
  formatSensorAge,
} from '../i18n/Formatters';

@injectable()
export default class ResponseFormatter {
  constructor(private i18n: i18n) {}
  async formatError(
    errorType: ErrorTypes,
    query: DiabetesQuery
  ): Promise<AssistantResponse> {
    // TODO
    return new AssistantResponse(errorType, query.locale);
  }

  async formatSnapshot(
    snapshot: DiabetesSnapshot,
    query: DiabetesQuery
  ): Promise<AssistantResponse> {
    await this.i18n.ensureLocale(query.locale);
    let SSML = '<speak>';

    query.pointers.forEach(async (pointer, i) => {
      const params = {
        pointer,
        snapshot,
        locale: query.locale,
        sayTimeAgo: i === 0, // Include time (as of N minutes ago) on the first pointer
        sayPointerName: query.pointers.length > 1, // Say the name of each pointer if there's > 1
      };
      SSML += `<s>${await formatPointer(pointer, params)}</s>`;
    });

    SSML += '</speak>';
    return new AssistantResponse(SSML, query.locale);
  }
}

function formatPointer(pointer: DiabetesPointer, params: FormatParams): Promise<string> {
  switch (pointer) {
    case DiabetesPointer.BloodSugar:
      return formatBloodSugar(params);
    case DiabetesPointer.CannulaAge:
      return formatCannulaAge(params);
    case DiabetesPointer.CarbsOnBoard:
      return formatCarbsOnBoard(params);
    case DiabetesPointer.InsulinOnBoard:
      return formatInsulinOnBoard(params);
    case DiabetesPointer.SensorAge:
      return formatSensorAge(params);
    default:
      throw 'Unable to format pointer ' + pointer;
  }
}
