import {i18next} from '../Localizer';
import FormatParams from '../../../types/FormatParams';
import {round, translateTimestamp} from './common';
import {pointerNotFound} from './error';
import {DiabetesPointer} from '../../../types/DiabetesPointer';

export default async function (params: FormatParams): Promise<string> {
  // Collect translation context
  const context = {
    value: round(params.snapshot.insulinOnBoard),
    time: await translateTimestamp(params.snapshot.timestamp, params.locale),
  };

  if (context.value === undefined)
    return pointerNotFound(DiabetesPointer.InsulinOnBoard, params);

  // Build translation key
  let key = 'assistant_responses.insulin_on_board.';
  key += params.sayPointerName ? 'long;' : 'short;';
  key += params.sayTimeAgo ? 'with_time' : 'no_time';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
