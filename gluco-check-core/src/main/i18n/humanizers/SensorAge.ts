import {i18next} from '..';
import FormatParams from '../../../types/FormatParams';
import {translateTimestamp} from './_common';
import {metricNotFound} from './_error';
import {DmMetric} from '../../../types/DmMetric';

export default async function (params: FormatParams): Promise<string> {
  if (!params.snapshot.sensorInserted) {
    return metricNotFound(DmMetric.SensorAge, params);
  }

  // Collect translation context
  const context = {
    time: await translateTimestamp(params.snapshot.sensorInserted!, params.locale),
  };

  // Build translation key
  const key = 'assistant_responses.sensor_age';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
