import {i18next} from '../Localizer';
import FormatParams from '../../../types/FormatParams';

export default async function (params: FormatParams): Promise<string> {
  // Collect translation context
  const context = {
    percent: params.snapshot.pumpBattery,
  };

  // Build translation key
  const key = 'assistant_responses.pump_battery';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
