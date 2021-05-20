import {i18next} from '..';
import {formatNumber} from './_common';
import {metricNotFound} from './_error';
import {DmMetric} from '../../../types/DmMetric';
import FormatParams from '../../../types/FormatParams';

export default async function (params: FormatParams): Promise<string> {
  if (!params.snapshot.pumpReservoir) {
    return metricNotFound(DmMetric.PumpReservoir, params);
  }

  // Collect translation context
  const context = {
    reservoir: formatNumber(params.snapshot.pumpReservoir, params.locale, 0),
  };

  // Build translation key
  const key = 'assistant_responses.pump_reservoir';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
