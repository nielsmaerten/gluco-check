/**
 * Humanizers turn FormatParams into human text.
 * There's a Humanizer for each DiabetesPointer.
 *
 * FormatParams contain the snapshot, a locale and
 * some additional info to help with localization.
 *
 * When ResponseFormatter is formatting a DiabetesSnapshot into an AssistantResponse,
 * it does so by running each of the pointers through its own Humanizer.
 */
import FormatParams from '../../types/FormatParams';
import {GlucoseTrend} from '../../types/GlucoseTrend';
import {i18next} from './Localizer';
import {logger} from 'firebase-functions';

import dayjs = require('dayjs');
import relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

//#region Humanizer Functions

export async function formatBloodSugar(params: FormatParams): Promise<string> {
  const ctx = {
    value: params.snapshot.glucoseValue(),
    trend: translateTrend(params.locale, params.snapshot.glucoseTrend),
    time: await translateTimestamp(params.snapshot.timestamp, params.locale),
  };

  // Build translation key
  let key = 'assistant_responses.blood_sugar.';
  key += params.sayPointerName ? 'long;' : 'short;';
  key += ctx.trend ? 'with_trend;' : 'no_trend;';
  key += params.sayTimeAgo ? 'with_time' : 'no_time';

  // Get localized string
  return i18next.getFixedT(params.locale)(key, ctx);
}

export async function formatCarbsOnBoard(params: FormatParams): Promise<string> {
  const ctx = {
    value: round(params.snapshot.carbsOnBoard),
    time: await translateTimestamp(params.snapshot.timestamp, params.locale),
  };

  let key = 'assistant_responses.carbs_on_board.';
  key += params.sayPointerName ? 'long;' : 'short;';
  key += params.sayTimeAgo ? 'with_time' : 'no_time';

  return i18next.getFixedT(params.locale)(key, ctx);
}

export async function formatInsulinOnBoard(params: FormatParams): Promise<string> {
  const ctx = {
    value: round(params.snapshot.insulinOnBoard, 2),
    time: await translateTimestamp(params.snapshot.timestamp, params.locale),
  };

  let key = 'assistant_responses.insulin_on_board.';
  key += params.sayPointerName ? 'long;' : 'short;';
  key += params.sayTimeAgo ? 'with_time' : 'no_time';

  return i18next.getFixedT(params.locale)(key, ctx);
}

export async function formatSensorAge(params: FormatParams): Promise<string> {
  const ctx = {
    time: await translateTimestamp(params.snapshot.sensorInserted!, params.locale),
  };
  const key = 'assistant_responses.sensor_age';
  return i18next.getFixedT(params.locale)(key, ctx);
}

export async function formatCannulaAge(params: FormatParams): Promise<string> {
  const ctx = {
    time: await translateTimestamp(params.snapshot.cannulaInserted!, params.locale),
  };
  const key = 'assistant_responses.cannula_age';
  return i18next.getFixedT(params.locale)(key, ctx);
}

export async function formatPumpBattery(params: FormatParams): Promise<string> {
  const ctx = {
    percent: params.snapshot.pumpBattery,
  };
  const key = 'assistant_responses.pump_battery';
  return i18next.getFixedT(params.locale)(key, ctx);
}

//#endregion

/**
 * Translates a timestamp to 'a few seconds', 'a minute', '3 minutes', etc.
 */
async function translateTimestamp(timestamp: number, locale: string) {
  // Ensure DayJs has the required locale loaded
  // The locale identifier may be changed to its generic version
  locale = await loadDayJsLocale(locale);

  // Turn the timestamp into a human expression
  return dayjs(timestamp).locale(locale).fromNow(true);
}

/**
 * Translates a trend into 'falling', 'rising slowly', etc ...
 */
function translateTrend(locale: string, trend?: string) {
  if (trend === GlucoseTrend.Unknown) return undefined;
  const key = `assistant_responses.blood_sugar.trends.${trend}`;
  return i18next.getFixedT(locale)(key);
}

/**
 * Rounds number to the desired precision (.1 by default)
 */
function round(v?: number, precision = 1) {
  if (v === undefined) return undefined;
  precision = Math.pow(10, precision);
  return Math.round(v * precision) / precision;
}

/**
 * Extends DayJs with translations so that it can
 * convert timestamps to human form in the specified locale.
 * 300000 ==> '5 minutes'
 * @returns The id of the locale that was loaded. Pass this id to dayjs(foo).locale(id)
 */
async function loadDayJsLocale(locale: string): Promise<string> {
  // DayJs uses lowercase to identify its locales
  locale = locale.toLowerCase();

  // Bail if locale (or its fallback) was loaded previously
  if (loadedDayJsLocales.has(locale)) return locale;
  const fallback = locale.substr(0, 2);
  if (loadedDayJsLocales.has(fallback)) return fallback;

  try {
    // Attempt loading the exact locale
    await import(`dayjs/locale/${locale}`);
    loadedDayJsLocales.add(locale);
    return locale;
  } catch (error) {
    // Attempt loading the fallback
    logger.warn(`DayJS: no locale for '${locale}'. Attempting fallback to '${fallback}'`);
    await import(`dayjs/locale/${fallback}`);
    loadedDayJsLocales.add(fallback);
    logger.info('DayJs: Fallback successful');
    return fallback;
  }
}
const loadedDayJsLocales = new Set<string>();
