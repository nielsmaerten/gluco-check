import {i18next} from '..';
import FormatParams from '../../../types/FormatParams';
import {metricNotFound} from './_error';
import {DmMetric} from '../../../types/DmMetric';

export default async function (params: FormatParams): Promise<string> {
  // Collect translation context
  const context = {
    percent: params.snapshot.pumpBattery,
  };

  if (context.percent === undefined) return metricNotFound(DmMetric.PumpBattery, params);

  // Build translation key
  const key = 'assistant_responses.pump_battery';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
