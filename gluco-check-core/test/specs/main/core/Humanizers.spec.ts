import {formatBloodSugar} from '../../../../src/main/i18n/Humanizers';
import DiabetesSnapshot from '../../../../src/types/DiabetesSnapshot';
import {GlucoseTrend} from '../../../../src/types/GlucoseTrend';
import {GlucoseUnit} from '../../../../src/types/GlucoseUnit';
import Localizer from '../../../../src/main/i18n/Localizer';

describe('Humanizer', () => {
  it('turns a pointer into human-readable text', async () => {
    const context = {
      locale: 'en-US',
      sayPointerName: true,
      sayTimeAgo: true,
      snapshot: new DiabetesSnapshot(Date.now()),
    };
    context.snapshot.glucoseTrend = GlucoseTrend.Stable;
    context.snapshot.glucoseUnit = GlucoseUnit.mgDl;
    context.snapshot.glucoseValueMgDl = 120;

    await new Localizer().ensureLocale(context.locale);

    const result = await formatBloodSugar(context);
    expect(result).toEqual('Blood sugar is 120 and stable as of a few seconds ago.');
  });
});
