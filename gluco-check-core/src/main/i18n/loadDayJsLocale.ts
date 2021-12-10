const loadedDayJsLocales = new Set<string>();

/**
 * Ensures the given locale is available in dayjs.
 * @param locale The locale to load.
 * @returns The id of the locale that should be entered in dayjs(foo).locale(id).
 */
export default async function loadDayJsLocale(locale: string): Promise<string> {
  // Get all possible locale ids
  const possibleLocaleIds = getPossibleLocaleIds(locale);

  // Check if one of the possible locales is already loaded
  for (const possibleLocaleId of possibleLocaleIds) {
    if (loadedDayJsLocales.has(possibleLocaleId)) {
      return possibleLocaleId;
    }
  }

  // If no locale is loaded, try to load the first possible one
  for (const possibleLocaleId of possibleLocaleIds) {
    try {
      const loadedLocaleId = await tryLoadingLocale(possibleLocaleId);
      loadedDayJsLocales.add(loadedLocaleId);
      return loadedLocaleId;
    } catch (e) {
      // If the locale is not available, try the next possible locale
    }
  }

  // If no locale could be loaded, throw an error
  throw new Error(`Could not load locale ${locale}`);
}

async function tryLoadingLocale(locale: string) {
  await import(`dayjs/locale/${locale}`);
  return locale;
}

/**
 * Returns all possible locale ids for the given locale.
 * Example: for 'en-US', returns 'en-us', 'en' and 'custom'
 */
function getPossibleLocaleIds(locale: string) {
  const lowercaseLocale = locale.toLowerCase(); // 'en-US' -> 'en-us'
  const twoLetterLocale = lowercaseLocale.substring(0, 2); // 'en-US' -> 'en'
  const customLocale = customFallbackMap.get(twoLetterLocale); // 'no-NO' -> 'nb'

  const possibleLocales = [lowercaseLocale, twoLetterLocale];

  // If customLocale exists, add it to the list of possible locale ids
  if (customLocale) {
    possibleLocales.push(customLocale);
  }

  return possibleLocales;
}

/**
 * If both the main locale (eg en-US) and its fallback (eg en) fail,
 * select a fallback from this map.
 */
const customFallbackMap = new Map<string, string>([['no', 'nb']]);
