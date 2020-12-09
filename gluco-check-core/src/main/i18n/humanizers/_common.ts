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
 * Reformats a number with new locale, percent/decimal and precision
 */
export const formatNumber = (
  value: number | undefined,
  locale: string,
  precision = 1,
  style = 'decimal'
) => {
  // For undefined, bail. For percentages, first divide by 100
  if (value === undefined) return undefined;
  const n = style === 'percent' ? value / 100 : value;

  if (locale !== 'en-US') {
    // When using a non default locale,
    // we override NumberFormat with a polyfill that has the full ICU
    Intl.NumberFormat = require('intl').NumberFormat;
  }

  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: precision,
    style: style,
    useGrouping: false,
  });

  return formatter.format(n);
};
