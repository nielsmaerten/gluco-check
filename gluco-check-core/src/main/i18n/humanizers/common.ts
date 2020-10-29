import dayjs = require('dayjs');
import relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
import {loadDayJsLocale} from '../Localizer';

/**
 * Translates a timestamp to 'a few seconds', 'a minute', '3 minutes', etc.
 */
export const translateTimestamp = async (timestamp: number, locale: string) => {
  // Ensure DayJs has the required locale loaded
  // The locale identifier may be changed to its generic version
  locale = await loadDayJsLocale(locale);

  // Turn the timestamp into a human expression
  return dayjs(timestamp).locale(locale).fromNow(true);
};

/**
 * Rounds number to the desired precision (.1 by default)
 */
export const round = (v?: number, precision = 1) => {
  if (v === undefined) return undefined;
  precision = Math.pow(10, precision);
  return Math.round(v * precision) / precision;
};
