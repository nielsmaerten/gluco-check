import {i18next} from '..';
import FormatParams from '../../../types/FormatParams';
import {translateTimestamp} from './_common';
import {metricNotFound} from './_error';
import {DmMetric} from '../../../types/DmMetric';

export default async function (params: FormatParams): Promise<string> {
  if (!params.snapshot.cannulaInserted) {
    return metricNotFound(DmMetric.CannulaAge, params);
  }

  // Collect translation context
  const context = {
    time: await translateTimestamp(params.snapshot.cannulaInserted!, params.locale),
  };

  // Build translation key
  const key = 'assistant_responses.cannula_age';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
