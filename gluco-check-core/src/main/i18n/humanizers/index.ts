import bloodSugar from './BloodSugar';
import cannulaAge from './CannulaAge';
import sensorAge from './SensorAge';
import pumpBattery from './PumpBattery';
import pumpReservoir from './PumpReservoir';
import carbsOnBoard from './CarbsOnBoard';
import insulinOnBoard from './InsulinOnBoard';
import dmSnapshot from './DmSnapshot';
import disclaimer from './_disclaimer';
import error from './_error';
import {DmMetric} from '../../../types/DmMetric';

/**
 * Humanizers turn internal concepts (DmMetric/DmSnapshot/Errors) into human text
 */
export default {
  bloodSugar,
  cannulaAge,
  sensorAge,
  pumpBattery,
  pumpReservoir,
  carbsOnBoard,
  insulinOnBoard,
  error,
  dmSnapshot,
  disclaimer,
};

export const findHumanizerFor = (metric: DmMetric) => {
  switch (metric) {
    case DmMetric.BloodSugar:
      return bloodSugar;
    case DmMetric.CannulaAge:
      return cannulaAge;
    case DmMetric.CarbsOnBoard:
      return carbsOnBoard;
    case DmMetric.InsulinOnBoard:
      return insulinOnBoard;
    case DmMetric.SensorAge:
      return sensorAge;
    case DmMetric.PumpBattery:
      return pumpBattery;
    case DmMetric.PumpReservoir:
      return pumpReservoir;
    /* istanbul ignore next */
    default:
      throw new Error('[Humanizer]: Unable to humanize metric ' + metric);
  }
};
