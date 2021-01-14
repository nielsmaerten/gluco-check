import {DmMetric} from './DmMetric';
import DmQuery from './DmQuery';
import {ErrorType} from './ErrorType';
import {GlucoseTrend} from './GlucoseTrend';
import {GlucoseUnit} from './GlucoseUnit';

const mg_dl_to_mmol_l = (val: number) => Math.round(val / 1.8) / 10;

/**
 * A DmSnapshot represents the state of someone's diabetes at a certain point in time.
 */
export default class DmSnapshot {
  // Required properties
  timestamp!: number;
  query!: DmQuery;

  // Optional error info
  errors: Array<{
    type: ErrorType;
    affectedMetric: DmMetric;
  }> = [];

  /**
   * @param query The DmQuery this DmSnapshot is trying to answer
   */
  constructor(props: Partial<DmSnapshot>) {
    Object.assign(this, props);
    if (!this.timestamp)
      throw new Error('Timestamp is a required property on DmSnapshot');
    if (!this.query) throw new Error('Query is a required property on DmSnapshot');
  }

  /**
   * Merge with another partial DmSnapshot
   */
  update(...parts: Partial<DmSnapshot>[]) {
    parts.forEach(source => {
      // If the source snapshot contains errors, add them to our own errors array
      source.errors && this.errors.push(...source.errors);
      delete source.errors;

      // Ensure timestamp is not overwritten by 0/NaN/null/undefined
      if (!source.timestamp) delete source.timestamp;

      // Assign remaining props
      Object.assign(this, source);
    });
  }

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
  pumpReservoir?: number;
}
