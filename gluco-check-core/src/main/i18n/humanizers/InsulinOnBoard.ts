import {i18next} from '..';
import FormatParams from '../../../types/FormatParams';
import {round, translateTimestamp} from './_common';
import {metricNotFound} from './_error';
import {DmMetric} from '../../../types/DmMetric';

export default async function (params: FormatParams): Promise<string> {
  // Collect translation context
  const context = {
    value: round(params.snapshot.insulinOnBoard),
    time: await translateTimestamp(params.snapshot.timestamp, params.locale),
  };

  if (context.value === undefined) return metricNotFound(DmMetric.InsulinOnBoard, params);

  // Build translation key
  let key = 'assistant_responses.insulin_on_board.';
  key += params.sayMetricName ? 'long;' : 'short;';
  key += params.sayTimeAgo ? 'with_time' : 'no_time';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
