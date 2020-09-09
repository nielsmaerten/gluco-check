import {TFunction, i18n} from 'i18next';
import {logger} from 'firebase-functions';
import {injectable} from 'inversify';

// i18next won't work unless we import it using 'require'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const i18next: i18n = require('i18next');
export {i18next};

/**
 * Localizer sets up i18next and manages loading translations
 */
@injectable()
export default class Localizer {
  private i18nextInitialized: Promise<TFunction>;
  private loadedLocales = new Set<string>();

  constructor() {
    logger.debug('[Localizer]: Initializing new instance');
    const debug = false;
    //const debug = process.env.NODE_ENV === 'test';

    this.i18nextInitialized = i18next.init({
      resources: {},
      debug,
    });
  }

  async ensureLocale(locale: string): Promise<void> {
    // Bail if the locale is already loaded
    if (this.loadedLocales.has(locale)) return;

    // Wait until i18next is ready
    await this.i18nextInitialized;

    // Import the locale's resource bundle
    let resourceBundle;
    try {
      resourceBundle = this.importResources(locale);
    } catch {
      // Fallback to generic language bundle if not found
      const fallback = locale.substr(0, 2);
      logger.debug(
        `[Localizer.I18Next]: No exact translation for ${locale}.`,
        `Attempting fallback to ${fallback}`
      );
      resourceBundle = this.importResources(fallback);
    }

    // Add the bundle to i18next (using default namespace 'translation')
    this.loadedLocales.add(locale);
    i18next.addResourceBundle(locale, 'translation', resourceBundle);
    logger.debug(`[Localizer.I18Next]: Translations for ${locale} have been loaded`);
  }

  private importResources(locale: string) {
    const resourceName = 'assistant-responses.json';
    return require(`gluco-check-common/strings/${locale}/${resourceName}`);
  }
}

/**
 * Extends DayJs with translations so that it can
 * convert timestamps to human form in the specified locale.
 * 300000 ==> '5 minutes'
 * @returns The id of the locale that was loaded. Pass this id to dayjs(foo).locale(id)
 */
export async function loadDayJsLocale(locale: string): Promise<string> {
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
    logger.warn(
      `[Localizer.DayJS]: No locale for '${locale}'.`,
      `Attempting fallback to '${fallback}'`
    );
    await import(`dayjs/locale/${fallback}`);
    loadedDayJsLocales.add(fallback);
    logger.info('[Localizer.DayJs]: Fallback successful');
    return fallback;
  }
}
const loadedDayJsLocales = new Set<string>();
