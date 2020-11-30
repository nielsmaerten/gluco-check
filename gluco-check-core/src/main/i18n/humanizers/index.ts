import bloodSugar from './BloodSugar';
import cannulaAge from './CannulaAge';
import sensorAge from './SensorAge';
import pumpBattery from './PumpBattery';
import carbsOnBoard from './CarbsOnBoard';
import insulinOnBoard from './InsulinOnBoard';
import dmSnapshot from './DmSnapshot';
import error from './_error';

/**
 * Humanizers turn internal concepts (DmMetric/DmSnapshot/Errors) into human text
 */
export default {
  bloodSugar,
  cannulaAge,
  sensorAge,
  pumpBattery,
  carbsOnBoard,
  insulinOnBoard,
  error,
  dmSnapshot,
};
