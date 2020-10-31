import {i18next} from '../Localizer';
import FormatParams from '../../../types/FormatParams';
import {pointerNotFound} from './error';
import {DiabetesPointer} from '../../../types/DiabetesPointer';

export default async function (params: FormatParams): Promise<string> {
  // Collect translation context
  const context = {
    percent: params.snapshot.pumpBattery,
  };

  if (context.percent === undefined)
    return pointerNotFound(DiabetesPointer.PumpBattery, params);

  // Build translation key
  const key = 'assistant_responses.pump_battery';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
