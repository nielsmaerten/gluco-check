import {i18next} from '..';
import FormatParams from '../../../types/FormatParams';
import {formatNumber, translateTimestamp} from './_common';
import {metricNotFound} from './_error';
import {DmMetric} from '../../../types/DmMetric';

export default async function (params: FormatParams): Promise<string> {
  if (params.snapshot.carbsOnBoard === undefined) {
    return metricNotFound(DmMetric.CarbsOnBoard, params);
  }

  // Collect translation context
  const context = {
    value: formatNumber(params.snapshot.carbsOnBoard, params.locale),
    time: await translateTimestamp(params.snapshot.timestamp, params.locale),
  };

  // Build translation key
  let key = 'assistant_responses.carbs_on_board.';
  key += params.sayMetricName ? 'long;' : 'short;';
  key += params.sayTimeAgo ? 'with_time' : 'no_time';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
