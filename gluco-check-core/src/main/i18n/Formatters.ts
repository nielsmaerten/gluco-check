// TODO

import FormatParams from '../../types/FormatParams';

import i18next from 'i18next';
import dayjs = require('dayjs');

export async function formatBloodSugar(params: FormatParams): Promise<string> {
  const ctx = {
    value: params.snapshot.glucoseValue(),
    trend: params.snapshot.glucoseTrend,
    timeAgo: await formatTimestamp(params.snapshot.timestamp, params.locale),
    sayPointerName: params.sayPointerName,
    sayTimeAgo: params.sayTimeAgo,
  };
  const t = i18next.getFixedT(params.locale);

  // +TimeAgo,+PointerName,+Trend: Blood sugar is 100 and stable as of 1 minute ago
  //                               Multiple pointers, bg is the first one and has trend

  // +TimeAgo,+PointerName,-Trend: Blood sugar is 100 as of 1 minute ago
  //                               Multiple pointers, bg is the first one and has no trend

  // +TimeAgo,-PointerName,+Trend: 100 and stable as of 1 minute ago
  //                               Single pointer, bg has trend

  // +TimeAgo,-PointerName,-Trend: 100 as of 1 minute ago
  //                               Single pointer, bg has no trend

  // -TimeAgo,+PointerName,+Trend: Blood sugar is 100 and stable
  //                               Multiple pointers, bg is not the first one and has trend

  // -TimeAgo,+PointerName,-Trend: Blood sugar is 100
  //                               Multiple pointers, bg is not the first one and has no trend

  // -TimeAgo,-PointerName,+Trend: 100 and stable
  //                               impossible

  // -TimeAgo,-PointerName,-Trend: 100
  //                               impossible

  // Are we reading multiple parameters? If so, mention pointername
  // Are we reading multiple params AND are we first? If so, mention time
  // Does the pointer include a trend?
  // Are we single param? Mention time

  // const includePointerName = isMultiplePointers || false;

  const bg = t('assistant.responses.bg', {value: ctx.value}); // Blood sugar is {{value}}
  const trend = t('assistant.reponses.bg.trend');
  // Blood sugar is {{value}} and {{trend}} as of {{timeAgo}} ago.
  // {{value}} and {{trend}} as of {{timeAgo}} ago.
  // ...
  return i18next.t('my.key', ctx);
}

export async function formatCannulaAge(params: FormatParams): Promise<string> {
  // Cannula was inserted {{timeAgo}} ago.
  return i18next.t('my.key', {});
}
export async function formatCarbsOnBoard(params: FormatParams): Promise<string> {
  // There's {{value}} carbs on board as of {{timeAgo}} ago.
  return i18next.t('my.key', {});
}
export async function formatInsulinOnBoard(params: FormatParams): Promise<string> {
  return i18next.t('my.key', {});
  // There are {{value}} units of insulin on board as of {{timeAgo}} ago.
}
export async function formatSensorAge(params: FormatParams): Promise<string> {
  // Sensor was inserted {{timeAgo}} ago.
  return i18next.t('my.key', {});
}

/**
 * Formats a relative timestamp to 'a few seconds', 'a minute', '3 minutes', etc.
 */
async function formatTimestamp(timestamp: number, locale: string) {
  try {
    await import(`dayjs/locale/${locale.toLowerCase()}`);
  } catch {
    // Fallback to generic locale
    locale = locale.substr(0, 2);
    await import(`dayjs/locale/${locale}`);
  }
  return dayjs(timestamp).locale(locale).fromNow(true);
}
