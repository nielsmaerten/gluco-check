/* eslint-disable @typescript-eslint/no-explicit-any */
import {GlucoseTrend} from '../../types/GlucoseTrend';
import {DiabetesPointer} from '../../types/DiabetesPointer';

/**
 * NightscoutQueries are used by NightscoutClient to perform specific api calls.
 * A Query includes:
 * - the path of the requested object
 * - querystring params to filter out the object from a collection
 * - a callback function that gets the required data from the http response
 */
export const BloodSugar = {
  pointers: DiabetesPointer.BloodSugar,
  path: '/api/v1/entries/current.json',
  params: {},
  callback: (data: any) => {
    return {
      glucoseTrend: parseNightscoutTrend(data.direction),
      glucoseValueMgDl: data.sgv || data.mbg || data.cal || data.etc,
    };
  },
};

export const DeviceStatus = {
  pointers: [DiabetesPointer.CarbsOnBoard, DiabetesPointer.InsulinOnBoard],
  path: '/api/v1/devicestatus.json',
  params: {count: 1},
  callback: (data: any) => {
    return {
      carbsOnBoard: data.openaps.suggested.COB,
      insulinOnBoard: data.openaps.iob.iob,
    };
  },
};

export const CannulaAge = {
  pointers: [DiabetesPointer.CannulaAge],
  path: '/api/v3/treatments.json',
  params: {eventType: 'Site Change'},
  callback: (data: any) => {
    return {
      cannulaInserted: new Date(data.created_at).getTime(),
      sensorInserted: new Date(data.created_at).getTime(),
    };
  },
};

export const SensorAge = {
  pointers: [DiabetesPointer.SensorAge],
  path: '/api/v3/treatments.json',
  params: {eventType: 'Sensor Change'},
  callback: (data: any) => {
    return {
      cannulaInserted: new Date(data.created_at).getTime(),
      sensorInserted: new Date(data.created_at).getTime(),
    };
  },
};

function parseNightscoutTrend(trend: string): GlucoseTrend {
  switch (trend) {
    case 'DoubleUp':
      return GlucoseTrend.RisingRapidly;
    case 'SingleUp':
      return GlucoseTrend.Rising;
    case 'FortyFiveUp':
      return GlucoseTrend.RisingSlowly;
    case 'Flat':
      return GlucoseTrend.Stable;
    case 'FortyFiveDown':
      return GlucoseTrend.FallingSlowly;
    case 'SingleDown':
      return GlucoseTrend.Falling;
    case 'DoubleDown':
      return GlucoseTrend.FallingRapidly;

    default:
      return GlucoseTrend.Unknown;
  }
}
