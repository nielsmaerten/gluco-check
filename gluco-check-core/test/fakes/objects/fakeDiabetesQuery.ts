import {DmMetric} from '../../../src/types/DmMetric';
import DmQuery from '../../../src/types/DmQuery';
import getFakeUser from './fakeUser';

export default () =>
  new DmQuery(getFakeUser(), 'en-US', [
    DmMetric.BloodSugar,
    DmMetric.CannulaAge,
    DmMetric.InsulinOnBoard,
    DmMetric.SensorAge,
    DmMetric.CarbsOnBoard,
    DmMetric.PumpBattery,
  ]);
