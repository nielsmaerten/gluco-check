import FormatParams from '../../types/FormatParams';
import {GlucoseTrend} from '../../types/GlucoseTrend';
import {i18next} from './Localizer';
import {logger} from 'firebase-functions';

import dayjs = require('dayjs');
import relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

export async function formatBloodSugar(params: FormatParams): Promise<string> {
  const ctx = {
    value: params.snapshot.glucoseValue(),
    trend: translateTrend(params.locale, params.snapshot.glucoseTrend),
    time: await humanizeTimestamp(params.snapshot.timestamp, params.locale),
    sayPointerName: params.sayPointerName,
    sayTimeAgo: params.sayTimeAgo,
  };

  // Build translation key
  let key = 'assistant_responses.blood_sugar.';
  key += ctx.sayPointerName ? 'long;' : 'short;';
  key += ctx.trend ? 'with_trend;' : 'no_trend;';
  key += ctx.sayTimeAgo ? 'with_time' : 'no_time';

  // Get localized string
  return i18next.getFixedT(params.locale)(key, ctx);
}

export async function formatCarbsOnBoard(params: FormatParams): Promise<string> {
  const ctx = {
    value: params.snapshot.carbsOnBoard,
    time: await humanizeTimestamp(params.snapshot.timestamp, params.locale),
  };

  let key = 'assistant_responses.carbs_on_board.';
  key += params.sayPointerName ? 'long;' : 'short;';
  key += params.sayTimeAgo ? 'with_time' : 'no_time';

  return i18next.getFixedT(params.locale)(key, ctx);
}

export async function formatInsulinOnBoard(params: FormatParams): Promise<string> {
  const ctx = {
    value: params.snapshot.insulinOnBoard,
    time: await humanizeTimestamp(params.snapshot.timestamp, params.locale),
  };

  let key = 'assistant_responses.insulin_on_board.';
  key += params.sayPointerName ? 'long;' : 'short;';
  key += params.sayTimeAgo ? 'with_time' : 'no_time';

  return i18next.getFixedT(params.locale)(key, ctx);
}

export async function formatSensorAge(params: FormatParams): Promise<string> {
  const ctx = {
    time: await humanizeTimestamp(params.snapshot.timestamp, params.locale),
  };
  const key = 'assistant_responses.sensor_age';
  return i18next.getFixedT(params.locale)(key, ctx);
}

export async function formatCannulaAge(params: FormatParams): Promise<string> {
  const ctx = {
    time: await humanizeTimestamp(params.snapshot.timestamp, params.locale),
  };
  const key = 'assistant_responses.cannula_age';
  return i18next.getFixedT(params.locale)(key, ctx);
}

/**
 * Formats a relative timestamp to 'a few seconds', 'a minute', '3 minutes', etc.
 */
async function humanizeTimestamp(timestamp: number, locale: string) {
  // Ensure DayJs has the required locale loaded
  // The locale identifier may be changed to its generic version
  locale = await loadDayJsLocale(locale);

  // Turn the timestamp into a human expression
  return dayjs(timestamp).locale(locale).fromNow(true);
}

function translateTrend(locale: string, trend?: string) {
  if (trend === GlucoseTrend.Unknown) return undefined;
  const key = `assistant_responses.blood_sugar.trends.${trend}`;
  return i18next.getFixedT(locale)(key);
}

const loadedDayJsLocales = new Set<string>();

async function loadDayJsLocale(locale: string) {
  // Bail if locale was loaded previously
  if (loadedDayJsLocales.has(locale)) return locale;

  try {
    // Attempt loading the exact locale
    await import(`dayjs/locale/${locale.toLowerCase()}`);
  } catch (error) {
    logger.warn(`No exact DayJs locale available for ${locale}. Attempting fallback`);

    locale = locale.substr(0, 2);
    await import(`dayjs/locale/${locale}`);
  }

  // Return the (possibly modified) locale name
  return locale;
}
