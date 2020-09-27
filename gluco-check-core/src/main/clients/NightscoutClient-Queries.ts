// Because data returned from an axios endpoint is always 'any':
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
  key: 0,
  pointers: DiabetesPointer.BloodSugar,
  path: '/api/v1/entries/current',
  params: {},
  callback: (data: any) => {
    return {
      glucoseTrend: parseNightscoutTrend(data.direction),
      glucoseValueMgDl: data.sgv || data.mbg || data.cal || data.etc,
      timestamp: data.date,
    };
  },
};

export const DeviceStatus = {
  key: 1,
  pointers: [
    DiabetesPointer.CarbsOnBoard,
    DiabetesPointer.InsulinOnBoard,
    DiabetesPointer.PumpBattery,
  ],
  path: '/api/v3/devicestatus',
  params: {sort$desc: 'created_at', limit: 1, 'pump.clock$gte': ''},
  callback: (data: any) => {
    return {
      carbsOnBoard: data.openaps.suggested.COB,
      insulinOnBoard: data.openaps.iob.iob,
      pumpBattery: data.pump.battery.percent,
      timestamp: new Date(data.created_at).getTime(),
    };
  },
};

export const CannulaAge = {
  key: 2,
  pointers: [DiabetesPointer.CannulaAge],
  path: '/api/v3/treatments',
  params: {eventType: 'Site Change', sort$desc: 'created_at', limit: 1},
  callback: (data: any) => {
    return {
      cannulaInserted: new Date(data.created_at).getTime(),
    };
  },
};

export const SensorAge = {
  key: 3,
  pointers: [DiabetesPointer.SensorAge],
  path: '/api/v3/treatments',
  params: {eventType: 'Sensor Change', sort$desc: 'created_at', limit: 1},
  callback: (data: any) => {
    return {
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
