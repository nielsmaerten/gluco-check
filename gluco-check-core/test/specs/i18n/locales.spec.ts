import 'reflect-metadata';
import I18nHelper from '../../../src/main/i18n';
import Humanizer from '../../../src/main/i18n/humanizers/index';
import getFakeSnapshot from '../../fakes/objects/fakeDmSnapshot';

// Fake snapshot where all values are 5 minutes old
const testSnapshot = getFakeSnapshot();
const fiveMinutesAgo = Date.now() - 1000 * 60 * 5;
testSnapshot.cannulaInserted = fiveMinutesAgo;
testSnapshot.sensorInserted = fiveMinutesAgo;
testSnapshot.timestamp = fiveMinutesAgo;

describe('Locale', () => {
  describe('Dutch (nl-NL)', () => {
    const locale = 'nl-NL';
    beforeAll(async () => new I18nHelper().ensureLocale(locale));
    it('COB', () => runTest(locale, '10,1 koolhydraten aan boord.'));
    it('IOB', () => runTest(locale, '10,1 insuline eenheden aan boord.'));
    it('BG', () =>
      runTest(locale, 'Suikerspiegel is 120 en stabiel sinds 5 minuten geleden.'));
    it('PB', () => runTest(locale, 'De pompbatterij heeft nog 85%.'));
  });

  describe('English (en-US)', () => {
    const locale = 'en-US';
    beforeAll(async () => new I18nHelper().ensureLocale(locale));
    it('COB', () => runTest(locale, 'There are 10.1 carbs on board.'));
    it('IOB', () => runTest(locale, 'There are 10.1 insulin units on board.'));
    it('BG', () => runTest(locale, 'Blood sugar is 120 and stable as of 5 minutes ago.'));
    it('PR', () => runTest(locale, 'The pump has 50 units remaining.'));
  });
});

describe('Disclaimer', () => {
  it('is translated to English (en-US)', async () => {
    const locale = 'en-US';
    const expectedDisclaimer =
      'Just a reminder: I am not a doctor. ' +
      'If you need medical advice, consult your physician.';
    await new I18nHelper().ensureLocale(locale);
    testSnapshot.query.locale = locale;
    const actualDisclaimer = Humanizer.disclaimer(locale);
    expect(actualDisclaimer).toEqual(expectedDisclaimer);
  });

  it('falls back to generic language', async () => {
    try {
      await new I18nHelper().ensureLocale('nl-BE');
    } catch (error) {
      fail(error);
    }
  });

  it('throws an error when no resource bundle found', done => {
    const promise = new I18nHelper().ensureLocale('123-NO-REAL-LOCALE');
    promise
      .then(() => {
        // This promise should not succeed
        fail();
      })
      .catch(() => {
        // Error is expected
        done();
      });
  });
});

async function runTest(locale: string, expectedString: string) {
  await new I18nHelper().ensureLocale(locale);
  testSnapshot.query.locale = locale;
  const localizedStrings = await Humanizer.dmSnapshot(testSnapshot);
  expect(localizedStrings).toContain(expectedString);
}
