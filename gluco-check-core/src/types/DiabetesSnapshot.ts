import {GlucoseTrend} from './GlucoseTrend';
import {GlucoseUnit} from './GlucoseUnit';

/**
 * A DiabetesSnapshot represents the state of someone's diabetes at a certain point in time.
 * It will always include a timestamp. All other values are optional.
 */
export default class DiabetesSnapshot {
  timestamp!: number;

  // Blood sugar
  glucoseValue?: number;
  glucoseTrend?: GlucoseTrend;
  glucoseUnit?: GlucoseUnit;

  // Food and Insulin
  carbsOnBoard?: number;
  insulinOnBoard?: number;

  // Sensor and pump
  sensorInserted?: number;
  cannulaInserted?: number;

  constructor(params: DiabetesSnapshot) {
    Object.assign(this, params);
    if (!this.timestamp || this.timestamp <= 0) {
      throw 'DiabetesSnapshot.timestamp is a required property';
    }
  }
}
