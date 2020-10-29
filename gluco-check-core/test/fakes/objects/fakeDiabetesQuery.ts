import {DiabetesPointer} from '../../../src/types/DiabetesPointer';
import DiabetesQuery from '../../../src/types/DiabetesQuery';
import fakeUser from './fakeUser';

const fakeQuery = new DiabetesQuery(fakeUser, 'en-US', [
  DiabetesPointer.BloodSugar,
  DiabetesPointer.CannulaAge,
  DiabetesPointer.InsulinOnBoard,
  DiabetesPointer.SensorAge,
  DiabetesPointer.CarbsOnBoard,
  DiabetesPointer.PumpBattery,
]);
export default fakeQuery;
