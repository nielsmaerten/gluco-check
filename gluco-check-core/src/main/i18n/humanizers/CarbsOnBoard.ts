import {i18next} from '../Localizer';
import FormatParams from '../../../types/FormatParams';
import {round, translateTimestamp} from './common';

export default async function (params: FormatParams): Promise<string> {
  // Collect translation context
  const context = {
    value: round(params.snapshot.carbsOnBoard),
    time: await translateTimestamp(params.snapshot.timestamp, params.locale),
  };

  // Build translation key
  let key = 'assistant_responses.carbs_on_board.';
  key += params.sayPointerName ? 'long;' : 'short;';
  key += params.sayTimeAgo ? 'with_time' : 'no_time';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}