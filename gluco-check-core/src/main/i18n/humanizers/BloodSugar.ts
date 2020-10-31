import {pointerNotFound} from './error';
import {DiabetesPointer} from '../../../types/DiabetesPointer';
import FormatParams from '../../../types/FormatParams';
import {GlucoseTrend} from '../../../types/GlucoseTrend';
import {i18next} from '../Localizer';
import {translateTimestamp} from './common';

export default async function (params: FormatParams): Promise<string> {
  // Collect translation context
  const context = {
    value: params.snapshot.glucoseValue(),
    trend: translateTrend(params.locale, params.snapshot.glucoseTrend),
    time: await translateTimestamp(params.snapshot.timestamp, params.locale),
  };

  if (context.value === undefined) {
    return pointerNotFound(DiabetesPointer.BloodSugar, params.locale);
  }

  // Build translation key
  let key = 'assistant_responses.blood_sugar.';
  key += params.sayPointerName ? 'long;' : 'short;';
  key += context.trend ? 'with_trend;' : 'no_trend;';
  key += params.sayTimeAgo ? 'with_time' : 'no_time';

  // Get localized string
  return i18next.getFixedT(params.locale)(key, context);
}

/**
 * Translates a trend into 'falling', 'rising slowly', etc ...
 */
function translateTrend(locale: string, trend?: string) {
  if (trend === GlucoseTrend.Unknown) return undefined;
  const key = `assistant_responses.blood_sugar.trends.${trend}`;
  return i18next.getFixedT(locale)(key);
}
