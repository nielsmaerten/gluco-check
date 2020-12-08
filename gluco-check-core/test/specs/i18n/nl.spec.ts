import 'reflect-metadata';
import I18nHelper from '../../../src/main/i18n';
import Humanizer from '../../../src/main/i18n/humanizers/index';
import getFakeSnapshot from '../../fakes/objects/fakeDmSnapshot';

describe('i18n Dutch', () => {
  it('formats a snapshot in Dutch', async () => {
    // Create a fake snapshot, override its locale to NL
    const testSnapshot = getFakeSnapshot();
    testSnapshot.query.locale = 'nl-NL';

    // Pretend values are 5 minutes old
    const fiveMinutesAgo = Date.now() - 1000 * 60 * 5;
    testSnapshot.cannulaInserted = fiveMinutesAgo;
    testSnapshot.timestamp = fiveMinutesAgo;

    // Preload locale
    await new I18nHelper().ensureLocale(testSnapshot.query.locale);

    // Run snapshot through Humanizers
    const humanizedStrings = await Humanizer.dmSnapshot(testSnapshot);

    const expectedStrings = [
      'Suikerspiegel is 120 en stabiel sinds 5 minuten geleden.',
      'De canule is 5 minuten oud.',
    ];
    expect(humanizedStrings).toEqual(expectedStrings);
  });
});
