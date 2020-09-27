import {injectable} from 'inversify';

import Localizer from '../i18n/Localizer';
import DiabetesSnapshot from '../../types/DiabetesSnapshot';
import AssistantResponse from '../../types/AssistantResponse';
import DiabetesQuery from '../../types/DiabetesQuery';
import FormatParams from '../../types/FormatParams';

import {ErrorTypes} from '../../types/ErrorTypes';
import {DiabetesPointer} from '../../types/DiabetesPointer';
import * as Humanizer from '../i18n/Humanizers';
import {logger} from 'firebase-functions';

@injectable()
export default class ResponseFormatter {
  constructor(private localizer: Localizer) {}

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
    logger.debug('[ResponseFormatter]: Rendering', snapshot);
    // Wait until the required language has been loaded
    await this.localizer.ensureLocale(query.locale);

    // Start a new SSML string
    let SSML = '<speak>';

    // Turn each pointer into 'human' text
    const humanized_pointers = query.pointers.map(async (pointer, i) => {
      const params = {
        pointer,
        snapshot,
        locale: query.locale,

        // The first pointer in the list will include the time:
        // eg: 'Foo bar as of 5 minutes ago'
        sayTimeAgo: i === 0,

        // If the list has > 1 pointer, we read out each pointer's name:
        // eg: 'Blood sugar is foo bar '
        sayPointerName: query.pointers.length > 1,
      };
      const humanPointer = await humanizePointer(pointer, params);
      logger.debug('[ResponseFormatter]:', humanPointer);
      return `<s>${humanPointer} </s>`; // Note the space at the end of each pointer!
    });

    // Wait until all pointers have been turned into text,
    // then append them to the SSML
    SSML += (await Promise.all(humanized_pointers)).join('');

    // Close the SSML string and return
    SSML += '</speak>';
    return new AssistantResponse(SSML, query.locale);
  }
}

function humanizePointer(
  pointer: DiabetesPointer,
  params: FormatParams
): Promise<string> {
  switch (pointer) {
    case DiabetesPointer.BloodSugar:
      return Humanizer.formatBloodSugar(params);

    case DiabetesPointer.CannulaAge:
      return Humanizer.formatCannulaAge(params);

    case DiabetesPointer.CarbsOnBoard:
      return Humanizer.formatCarbsOnBoard(params);

    case DiabetesPointer.InsulinOnBoard:
      return Humanizer.formatInsulinOnBoard(params);

    case DiabetesPointer.SensorAge:
      return Humanizer.formatSensorAge(params);

    case DiabetesPointer.PumpBattery:
      return Humanizer.formatPumpBattery(params);

    default:
      throw 'Unable to humanize pointer ' + pointer;
  }
}
