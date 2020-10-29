import {i18next} from '../Localizer';
import FormatParams from '../../../types/FormatParams';
import {translateTimestamp} from './common';

export default async function (params: FormatParams): Promise<string> {
  // Collect translation context
  const context = {
    time: await translateTimestamp(params.snapshot.cannulaInserted!, params.locale),
  };

  // Build translation key
  const key = 'assistant_responses.cannula_age';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
