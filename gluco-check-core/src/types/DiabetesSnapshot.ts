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
    return this.glucoseValueMgDl / 18;
  }

  // Food and Insulin
  carbsOnBoard?: number;
  insulinOnBoard?: number;

  // Sensor and pump
  sensorInserted?: number;
  cannulaInserted?: number;

  constructor(timestamp: number) {
    this.timestamp = timestamp;
  }
}
