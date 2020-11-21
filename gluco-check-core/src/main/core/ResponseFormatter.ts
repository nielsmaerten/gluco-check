import {injectable} from 'inversify';

import Localizer from '../i18n/Localizer';
import DmSnapshot from '../../types/DmSnapshot';
import AssistantResponse from '../../types/AssistantResponse';
import DmQuery from '../../types/DmQuery';
import FormatParams from '../../types/FormatParams';

import {ErrorType} from '../../types/ErrorType';
import {DmMetric} from '../../types/DmMetric';
import Humanizer from '../i18n/humanizers';

@injectable()
export default class ResponseFormatter {
  constructor(private localizer: Localizer) {}

  async buildErrorResponse(
    errorType: ErrorType,
    query: DmQuery
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

  async buildResponse(snapshot: DmSnapshot, query: DmQuery): Promise<AssistantResponse> {
    // Ensure the required language has been loaded
    await this.localizer.ensureLocale(query.locale);

    // Turn every requested metric into human text
    const humanizedMetrics = await humanizeMetrics(query, snapshot);

    // Start a new SSML string
    let SSML = '<speak>';

    // Append human text for each metric
    SSML += humanizedMetrics

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

function humanizeMetrics(query: DmQuery, snapshot: DmSnapshot): Promise<string[]> {
  // For each metric, we need to decide how it will be formatted
  // This is expressed as a FormatParams object for each metric:
  const formatParams = getFormatParams(query, snapshot);
  return Promise.all(formatParams.map(humanizeMetric));

  // FIXME(architecture): Important: I really should review how things are named here,
  // because this is getting really confusing!
}

function getFormatParams(query: DmQuery, snapshot: DmSnapshot) {
  const {locale, metrics} = query;

  return metrics.map<FormatParams>((metric: DmMetric, i: number) => {
    return {
      metric,
      snapshot,
      locale,

      // The first metric in the list will include the time:
      // eg: 'Foo bar as of 5 minutes ago'
      sayTimeAgo: i === 0,

      // If the list has > 1 metric, we read the name of each one:
      // eg: 'Blood sugar is foo bar '
      sayMetricName: query.metrics.length > 1,
    };
  });
}

function humanizeMetric(params: FormatParams): Promise<string> {
  switch (params.metric) {
    case DmMetric.BloodSugar:
      return Humanizer.bloodSugar(params);

    case DmMetric.CannulaAge:
      return Humanizer.cannulaAge(params);

    case DmMetric.CarbsOnBoard:
      return Humanizer.carbsOnBoard(params);

    case DmMetric.InsulinOnBoard:
      return Humanizer.insulinOnBoard(params);

    case DmMetric.SensorAge:
      return Humanizer.sensorAge(params);

    case DmMetric.PumpBattery:
      return Humanizer.pumpBattery(params);

    default:
      throw new Error('Unable to humanize metric ' + params.metric);
  }
}
