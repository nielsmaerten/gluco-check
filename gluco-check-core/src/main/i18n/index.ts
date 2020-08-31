import i18next, {TFunction} from 'i18next';

export default class Localizer {
  private i18nextInitialized: Promise<TFunction>;

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

    const localeId = locale.substr(0, 2);
    const resourcePath = `gluco-check-common/${localeId}/strings.json`;
    const resourceBundle = require(resourcePath);

    i18next.addResourceBundle(locale, 'global', resourceBundle);
  }
}
