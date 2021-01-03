import {i18next} from '..';
import {formatNumber} from './_common';
import {metricNotFound} from './_error';
import {DmMetric} from '../../../types/DmMetric';
import FormatParams from '../../../types/FormatParams';

export default async function (params: FormatParams): Promise<string> {
  // Collect translation context
  const context = {
    reservoir: formatNumber(params.snapshot.pumpReservoir, params.locale),
  };

  if (context.reservoir === undefined)
    return metricNotFound(DmMetric.PumpReservoir, params);

  // Build translation key
  const key = 'assistant_responses.pump_reservoir';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
