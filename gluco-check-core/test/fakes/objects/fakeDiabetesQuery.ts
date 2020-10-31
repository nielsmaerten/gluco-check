import {DiabetesPointer} from '../../../src/types/DiabetesPointer';
import DiabetesQuery from '../../../src/types/DiabetesQuery';
import getFakeUser from './fakeUser';

export default () =>
  new DiabetesQuery(getFakeUser(), 'en-US', [
    DiabetesPointer.BloodSugar,
    DiabetesPointer.CannulaAge,
    DiabetesPointer.InsulinOnBoard,
    DiabetesPointer.SensorAge,
    DiabetesPointer.CarbsOnBoard,
    DiabetesPointer.PumpBattery,
  ]);
