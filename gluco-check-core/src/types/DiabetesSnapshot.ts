import {DiabetesPointer} from './DiabetesPointer';
import DiabetesQuery from './DiabetesQuery';
import {ErrorTypes} from './ErrorTypes';
import {GlucoseTrend} from './GlucoseTrend';
import {GlucoseUnit} from './GlucoseUnit';

const mg_dl_to_mmol_l = (val: number) => Math.round(val / 1.8) / 10;

/**
 * A DiabetesSnapshot represents the state of someone's diabetes at a certain point in time.
 */
export default class DiabetesSnapshot {
  timestamp!: number;
  originalQuery!: DiabetesQuery;

  constructor(timestamp: number, originalQuery: DiabetesQuery) {
    this.timestamp = timestamp;
    this.originalQuery = originalQuery;
  }

  update(...parts: Partial<DiabetesSnapshot>[]) {
    parts.forEach(part => {
      // If the partial snapshot has errors, add these to our errors array
      part.errors && this.errors.push(...part.errors);

      // Assign all remaining properties
      delete part.errors;
      Object.assign(this, part);
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

  // Optional error info
  errors: Array<{
    type: ErrorTypes;
    affectedPointer: DiabetesPointer;
  }> = [];
}
