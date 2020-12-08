import dayjs = require('dayjs');
import relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
import loadDayJsLocale from '../loadDayJsLocale';

/**
 * Translates a timestamp to 'a few seconds', 'a minute', '3 minutes', etc.
 */
export const translateTimestamp = async (timestamp: number, _locale: string) => {
  // Ensure DayJs has the required locale loaded
  // The locale identifier may be changed to its generic version
  const locale = await loadDayJsLocale(_locale);

  // Turn the timestamp into a human expression
  return dayjs(timestamp).locale(locale).fromNow(true);
};

/**
 * Rounds number to the desired precision (.1 by default)
 */
export const formatNumber = (
  value: number | undefined,
  locale: string,
  precision = 1,
  style = 'decimal'
) => {
  if (value === undefined) return undefined;

  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: precision,
    style: style,
    useGrouping: false,
  });

  return formatter.format(value);

  // precision = Math.pow(10, precision);
  // return Math.round(v * precision) / precision;
};
