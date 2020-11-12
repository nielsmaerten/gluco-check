import 'reflect-metadata';

import Humanizers from '../../../../src/main/i18n/humanizers';
import DiabetesSnapshot from '../../../../src/types/DiabetesSnapshot';
import {GlucoseTrend} from '../../../../src/types/GlucoseTrend';
import {GlucoseUnit} from '../../../../src/types/GlucoseUnit';
import Localizer from '../../../../src/main/i18n/Localizer';
import FormatParams from '../../../../src/types/FormatParams';
import getFakeQuery from '../../../fakes/objects/fakeDiabetesQuery';
import {DiabetesPointer} from '../../../../src/types/DiabetesPointer';

let params: FormatParams;

describe('Humanizer', () => {
  // Prepare a full snapshot and formatParams object to test against
  beforeEach(async () => {
    params = {
      pointer: DiabetesPointer.BloodSugar,
      locale: 'en-US',
      sayPointerName: true,
      sayTimeAgo: true,
      snapshot: new DiabetesSnapshot(Date.now() - 300000, getFakeQuery()), // 5 minutes ago
    };

    Object.assign(params.snapshot, {
      cannulaInserted: Date.now() - 86000000, // 24 hours ago
      carbsOnBoard: 10,
      glucoseTrend: GlucoseTrend.Stable,
      glucoseUnit: GlucoseUnit.mgDl,
      glucoseValueMgDl: 120,
      insulinOnBoard: 11,
      sensorInserted: Date.now() - 85000000, // 23 hours ago
    } as DiabetesSnapshot);

    await new Localizer().ensureLocale(params.locale);
  });

  it('formats full BG with trend and time', async () => {
    const result = await Humanizers.bloodSugar(params);
    expect(result).toEqual('Blood sugar is 120 and stable as of 5 minutes ago.');
  });

  it('formats full BG with time and no trend', async () => {
    params.snapshot.glucoseTrend = GlucoseTrend.Unknown;
    const result = await Humanizers.bloodSugar(params);
    expect(result).toEqual('Blood sugar is 120 as of 5 minutes ago.');
  });

  it('formats full BG with trend and no time', async () => {
    params.sayTimeAgo = false;
    const result = await Humanizers.bloodSugar(params);
    expect(result).toEqual('Blood sugar is 120 and stable.');
  });

  it('formats full BG with no trend and no time', async () => {
    params.sayTimeAgo = false;
    params.snapshot.glucoseTrend = GlucoseTrend.Unknown;
    const result = await Humanizers.bloodSugar(params);
    expect(result).toEqual('Blood sugar is 120.');
  });

  it('formats short BG with time and no trend', async () => {
    params.snapshot.glucoseTrend = GlucoseTrend.Unknown;
    params.sayPointerName = false;
    const result = await Humanizers.bloodSugar(params);
    expect(result).toEqual('120 as of 5 minutes ago.');
  });

  it('formats short BG with trend and time', async () => {
    params.sayPointerName = false;
    const result = await Humanizers.bloodSugar(params);
    expect(result).toEqual('120 and stable as of 5 minutes ago.');
  });
});
