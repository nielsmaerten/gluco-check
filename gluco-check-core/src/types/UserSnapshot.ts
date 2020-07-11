import {GlucoseTrend} from './GlucoseTrend';
import {GlucoseUnit} from './GlucoseUnit';

const oneHour = 60 * 60 * 1000;
const oneYear = 365 * 24 * oneHour;

/**
 * Represents the diabetes-state of a user at a certain point in time.
 */
export default class UserSnapshot {
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

  constructor(params: UserSnapshot) {
    Object.assign(this, params);
    validateTimestamp(this.timestamp);
  }
}

function validateTimestamp(timestamp: number) {
  if (!timestamp) {
    throw 'UserSnapshot requires a timestamp';
  }
  const now = Date.now();
  if (timestamp < now - oneYear) {
    throw 'UserSnapshot can\'t be older than 1 year';
  }
  if (timestamp > now + oneHour) {
    throw 'UserSnapshot can\'t be more than 1 hour in the future';
  }
}
