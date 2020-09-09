import {GlucoseTrend} from './GlucoseTrend';
import {GlucoseUnit} from './GlucoseUnit';

/**
 * A DiabetesSnapshot represents the state of someone's diabetes at a certain point in time.
 * It will always include a timestamp. All other values are optional.
 */
export default class DiabetesSnapshot {
  timestamp!: number;

  // Blood sugar
  glucoseTrend?: GlucoseTrend;
  glucoseUnit?: GlucoseUnit;
  glucoseValueMgDl?: number;

  glucoseValue() {
    if (this.glucoseValueMgDl === undefined) return undefined;
    if (this.glucoseUnit === GlucoseUnit.mgDl) return this.glucoseValueMgDl;
    return mg_dl_to_mmol_l(this.glucoseValueMgDl);
  }

  // Food and Insulin
  carbsOnBoard?: number;
  insulinOnBoard?: number;

  // Sensor and pump
  sensorInserted?: number;
  cannulaInserted?: number;
  pumpBattery?: number;

  constructor(timestamp: number) {
    this.timestamp = timestamp;
  }
}

const mg_dl_to_mmol_l = (val: number) => Math.round(val / 1.8) / 10;
