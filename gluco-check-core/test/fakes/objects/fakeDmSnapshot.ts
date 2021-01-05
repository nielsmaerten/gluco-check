import {DmMetric} from '../../../src/types/DmMetric';
import DmSnapshot from '../../../src/types/DmSnapshot';
import {GlucoseTrend} from '../../../src/types/GlucoseTrend';
import {GlucoseUnit} from '../../../src/types/GlucoseUnit';
import NightscoutProps from '../../../src/types/NightscoutProps';

const rawSnapshot: Partial<DmSnapshot> = {
  errors: [],
  query: {
    metadata: {
      mentionDisclaimer: true,
      mentionMissingMetrics: true,
    },
    user: {
      defaultMetrics: [DmMetric.Everything],
      exists: true,
      glucoseUnit: GlucoseUnit.mgDl,
      userId: 'fakeUser@example.com',
      nightscout: new NightscoutProps('https://cgm.example.com'),
    },
    locale: 'en-US',
    metrics: [
      DmMetric.BloodSugar,
      DmMetric.CannulaAge,
      DmMetric.CarbsOnBoard,
      DmMetric.InsulinOnBoard,
      DmMetric.PumpBattery,
      DmMetric.PumpReservoir,
      DmMetric.SensorAge,
    ],
  },
  timestamp: 1598705480000,
  glucoseUnit: GlucoseUnit.mgDl,
  glucoseTrend: GlucoseTrend.Stable,
  glucoseValueMgDl: 120,
  cannulaInserted: 1597744068000,
  carbsOnBoard: 10.123456,
  insulinOnBoard: 10.123456,
  pumpBattery: 85.123456,
  pumpReservoir: 50.12345,
  sensorInserted: 1598195121000,
};

export default () => new DmSnapshot(rawSnapshot);
