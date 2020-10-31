import {injectable} from 'inversify';

import Localizer from '../i18n/Localizer';
import DiabetesSnapshot from '../../types/DiabetesSnapshot';
import AssistantResponse from '../../types/AssistantResponse';
import DiabetesQuery from '../../types/DiabetesQuery';
import FormatParams from '../../types/FormatParams';

import {ErrorTypes} from '../../types/ErrorTypes';
import {DiabetesPointer} from '../../types/DiabetesPointer';
import Humanizer from '../i18n/humanizers';

@injectable()
export default class ResponseFormatter {
  constructor(private localizer: Localizer) {}

  async buildErrorResponse(
    errorType: ErrorTypes,
    query: DiabetesQuery
  ): Promise<AssistantResponse> {
    // Ensure the required language has been loaded
    await this.localizer.ensureLocale(query.locale);

    // Start a new SSML string
    let SSML = '<speak>';

    // Turn error into human text
    SSML += Humanizer.error(errorType, query.locale);

    // Terminate SSML string
    SSML += '</speak>';

    // Return an AssistantResponse
    return new AssistantResponse(SSML, query.locale);
  }

  async buildResponse(
    snapshot: DiabetesSnapshot,
    query: DiabetesQuery
  ): Promise<AssistantResponse> {
    // Ensure the required language has been loaded
    await this.localizer.ensureLocale(query.locale);

    // Turn every requested pointer into human text
    const humanizedPointers = await humanizePointers(query, snapshot);

    // Start a new SSML string
    let SSML = '<speak>';

    // Append human text for each pointer
    SSML += humanizedPointers

      // Wrap the human text in an SSML tag
      .map(
        txt => `<s>${txt} </s>` // Note the space after the text. (for readability)
      )
      // Join all SSML tags together
      .join('');

    // Terminate SSML string
    SSML += '</speak>';

    // Return an AssistantResponse
    return new AssistantResponse(SSML, query.locale);
  }
}

function humanizePointers(
  query: DiabetesQuery,
  snapshot: DiabetesSnapshot
): Promise<string[]> {
  // For each pointer, we need to decide how it will be formatted
  // This is expressed as a FormatParams object for each pointer:
  const formatParams = getFormatParams(query, snapshot);
  return Promise.all(formatParams.map(humanizePointer));

  // FIXME(architecture): Important: I really should review how things are named here,
  // because this is getting really confusing!
}

function getFormatParams(query: DiabetesQuery, snapshot: DiabetesSnapshot) {
  const {locale, pointers} = query;

  return pointers.map<FormatParams>((pointer: DiabetesPointer, i: number) => {
    return {
      pointer,
      snapshot,
      locale,

      // The first pointer in the list will include the time:
      // eg: 'Foo bar as of 5 minutes ago'
      sayTimeAgo: i === 0,

      // If the list has > 1 pointer, we read out each pointer's name:
      // eg: 'Blood sugar is foo bar '
      sayPointerName: query.pointers.length > 1,
    };
    //const humanPointer = await humanizePointer(pointer, params);
    //logger.debug('[ResponseFormatter]:', humanPointer);
    //return `<s>${humanPointer} </s>`; // Note the space at the end of each pointer!
  });
}

function humanizePointer(params: FormatParams): Promise<string> {
  switch (params.pointer) {
    case DiabetesPointer.BloodSugar:
      return Humanizer.bloodSugar(params);

    case DiabetesPointer.CannulaAge:
      return Humanizer.cannulaAge(params);

    case DiabetesPointer.CarbsOnBoard:
      return Humanizer.carbsOnBoard(params);

    case DiabetesPointer.InsulinOnBoard:
      return Humanizer.insulinOnBoard(params);

    case DiabetesPointer.SensorAge:
      return Humanizer.sensorAge(params);

    case DiabetesPointer.PumpBattery:
      return Humanizer.pumpBattery(params);

    default:
      throw new Error('Unable to humanize pointer ' + params.pointer);
  }
}
