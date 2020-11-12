import {i18next} from '../Localizer';
import FormatParams from '../../../types/FormatParams';
import {translateTimestamp} from './common';
import {pointerNotFound} from './error';
import {DiabetesPointer} from '../../../types/DiabetesPointer';

export default async function (params: FormatParams): Promise<string> {
  // Collect translation context
  const context = {
    time: await translateTimestamp(params.snapshot.cannulaInserted!, params.locale),
  };

  if (!context.time) return pointerNotFound(DiabetesPointer.CannulaAge, params);

  // Build translation key
  const key = 'assistant_responses.cannula_age';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
