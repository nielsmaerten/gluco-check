import {i18next} from '../Localizer';
import FormatParams from '../../../types/FormatParams';
import {translateTimestamp} from './common';
import {pointerNotFound} from './error';
import {DiabetesPointer} from '../../../types/DiabetesPointer';

export default async function (params: FormatParams): Promise<string> {
  // Collect translation context
  const context = {
    time: await translateTimestamp(params.snapshot.sensorInserted!, params.locale),
  };

  if (context.time === undefined)
    return pointerNotFound(DiabetesPointer.SensorAge, params.locale);

  // Build translation key
  const key = 'assistant_responses.sensor_age';

  // Return localized string
  return i18next.getFixedT(params.locale)(key, context);
}
