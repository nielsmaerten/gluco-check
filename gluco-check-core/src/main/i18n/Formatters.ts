import FormatParams from '../../types/FormatParams';

import i18next from 'i18next';
import dayjs = require('dayjs');

export async function formatBloodSugar(params: FormatParams) {
  const ctx = {
    value: params.snapshot.glucoseValue(),
    trend: params.snapshot.glucoseTrend,
    timeAgo: await formatTimestamp(params.snapshot.timestamp, params.locale),
  };
  const key = `[Blood sugar is] ${ctx.value} [and ${ctx.trend}] [as of ${ctx.timeAgo} ago]`;
  console.log(i18next.t("my.key", ctx))
  return "hello";
}

export async function formatCannulaAge(params: FormatParams) {
  return `Cannula was inserted XYZ ago.`;
}
export async function formatCarbsOnBoard(params: FormatParams) {
  return `[There are] XYZ [carbs on board] [as of ABC ago]`;
}
export async function formatInsulinOnBoard(params: FormatParams) {
  return `[There are] XYZ [units of insulin on board] [as of ABC ago]`;
}
export async function formatSensorAge(params: FormatParams) {
  return `Sensor was inserted XYZ ago.`;
}

/**
 * Formats a relative timestamp to 'a few seconds', 'a minute', '3 minutes', etc.
 */
async function formatTimestamp(timestamp: number, locale: string) {
  await import(`dayjs/locale/${locale}`);
  return dayjs(timestamp).locale(locale).fromNow(true);
}
