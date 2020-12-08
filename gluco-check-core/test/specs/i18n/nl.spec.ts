import 'reflect-metadata';
import I18nHelper from '../../../src/main/i18n';
import Humanizer from '../../../src/main/i18n/humanizers/index';
import getFakeSnapshot from '../../fakes/objects/fakeDmSnapshot';

// Create a fake snapshot, override its locale to NL
const testSnapshot = getFakeSnapshot();
testSnapshot.query.locale = 'nl-NL';

// Pretend values are 5 minutes old
const fiveMinutesAgo = Date.now() - 1000 * 60 * 5;
testSnapshot.cannulaInserted = fiveMinutesAgo;
testSnapshot.timestamp = fiveMinutesAgo;

describe('i18n Dutch', () => {
  beforeAll(async () => {
    await new I18nHelper().ensureLocale(testSnapshot.query.locale);
  });
  it('formats a snapshot in Dutch', async () => {
    // Run snapshot through Humanizers
    const humanizedStrings = await Humanizer.dmSnapshot(testSnapshot);
    expect(humanizedStrings).toContain(
      'Suikerspiegel is 120 en stabiel sinds 5 minuten geleden.'
    );
  });

  it('formats decimal numbers using a comma', async () => {
    const humanizedStrings = await Humanizer.dmSnapshot(testSnapshot);
    expect(humanizedStrings).toContain('Er zijn 38,5 koolhydraten aan boord.');
  });
});
