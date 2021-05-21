import {i18next} from '..';
import FormatParams from '../../../types/FormatParams';
import {metricNotFound} from './_error';
import {DmMetric} from '../../../types/DmMetric';
import {formatNumber} from './_common';

export default async function (params: FormatParams): Promise<string> {
  if (params.snapshot.pumpBattery === undefined) {
    return metricNotFound(DmMetric.PumpBattery, params);
  }

  // Collect translation context
  const context = {
    percent: formatNumber(params.snapshot.pumpBattery, params.locale, 0, 'percent'),
  };

  // Build translation key
  const key = 'assistant_responses.pump_battery';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
