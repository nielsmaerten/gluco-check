import FormatParams from '../../types/FormatParams';
import {GlucoseTrend} from '../../types/GlucoseTrend';
import {logger} from 'firebase-functions';

import dayjs = require('dayjs');
import relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

import {i18n} from 'i18next';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const i18next: i18n = require('i18next');
const translate = i18next.getFixedT;

export async function formatBloodSugar(params: FormatParams): Promise<string> {
  const ctx = {
    value: params.snapshot.glucoseValue(),
    trend: params.snapshot.glucoseTrend,
    timeAgo: await humanizeTimestamp(params.snapshot.timestamp, params.locale),
    sayPointerName: params.sayPointerName,
    sayTimeAgo: params.sayTimeAgo,
  };

  // Build translation key
  let key = 'assistant_responses.blood_sugar.';
  key += ctx.sayPointerName ? 'long;' : 'short;';
  key += ctx.trend === GlucoseTrend.Unknown ? 'no_trend;' : 'with_trend;';
  key += ctx.sayTimeAgo ? 'with_time' : 'no_time';

  // Get localized string
  return translate(params.locale)(key, ctx);
}

export async function formatCannulaAge(params: FormatParams): Promise<string> {
  // Cannula was inserted {{timeAgo}} ago.
  return '';
}
export async function formatCarbsOnBoard(params: FormatParams): Promise<string> {
  // There's {{value}} carbs on board as of {{timeAgo}} ago.
  return '';
}
export async function formatInsulinOnBoard(params: FormatParams): Promise<string> {
  return '';
  // There are {{value}} units of insulin on board as of {{timeAgo}} ago.
}
export async function formatSensorAge(params: FormatParams): Promise<string> {
  // Sensor was inserted {{timeAgo}} ago.
  return '';
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
