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
    logger.debug('I18Next: Initializing');
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
      logger.warn(
        `[Localizer.I18Next]: No exact translation for ${locale}.`,
        `Attempting fallback to ${fallback}`
      );
      resourceBundle = this.importResources(fallback);
      logger.info('[Localizer.I18Next]: Fallback successful');
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
