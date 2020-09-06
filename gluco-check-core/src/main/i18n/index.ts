/* eslint-disable @typescript-eslint/no-var-requires */
import {TFunction, i18n} from 'i18next';
const i18next: i18n = require('i18next'); // i18next requires a 'require' style import

export default class Localizer {
  private i18nextInitialized: Promise<TFunction>;
  private loadedLocales = new Set<string>();

  constructor() {
    const options = {
      fallbackLng: 'dev',
      lng: 'cimode',
      resources: {},
    };

    this.i18nextInitialized = i18next.init(options);
  }

  async ensureLocale(locale: string): Promise<void> {
    await this.i18nextInitialized;

    // Check if the locale is already loaded
    if (this.loadedLocales.has(locale)) return;

    // Import the locale's resource bundle
    const resourcePath = `gluco-check-common/${locale}/strings`;
    const resourceBundle = require(resourcePath);

    // Add the bundle to i18next
    i18next.addResourceBundle(locale, 'global', resourceBundle);
    this.loadedLocales.add(locale);
  }

  getFixedT = i18next.getFixedT;
}
