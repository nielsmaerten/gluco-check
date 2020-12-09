import {logger} from 'firebase-functions';
const availableDayJsLocales = new Set<string>();

/**
 * Extends DayJs with translations so that it can
 * convert timestamps to human form in the specified locale.
 * 300000 ==> '5 minutes'
 * @returns The id of the locale that was loaded. Pass this id to dayjs(foo).locale(id)
 */
export default async function loadDayJsLocale(_locale: string): Promise<string> {
  // DayJs uses lowercase to identify its locales
  const locale = _locale.toLowerCase();
  const fallback = locale.substr(0, 2);

  // Bail if locale (or its fallback) was loaded previously
  if (availableDayJsLocales.has(locale)) return locale;
  if (availableDayJsLocales.has(fallback)) return fallback;

  logger.debug(`[Localizer.DayJS]: Importing locale: ${locale}`);
  try {
    // Attempt loading the exact locale
    await import(`dayjs/locale/${locale}`);
    availableDayJsLocales.add(locale);
    return locale;
  } catch (error) {
    // Attempt loading the fallback
    await import(`dayjs/locale/${fallback}`);
    availableDayJsLocales.add(fallback);
    return fallback;
  }
}
