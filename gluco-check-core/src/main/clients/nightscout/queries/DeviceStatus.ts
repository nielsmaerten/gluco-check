import {DiabetesPointer} from '../../../../types/DiabetesPointer';
import QueryConfig from './QueryConfig.base';

export const DeviceStatus: QueryConfig = {
  key: 'DS',
  pointers: [
    DiabetesPointer.CarbsOnBoard,
    DiabetesPointer.InsulinOnBoard,
    DiabetesPointer.PumpBattery,
  ],
  path: '/api/v3/devicestatus',
  params: {sort$desc: 'created_at', limit: 1, 'pump.clock$gte': ''},
  callback: (data: any) => { // eslint-disable-line
    return {
      carbsOnBoard: data.openaps?.suggested?.COB || data.loop?.cob.cob,
      insulinOnBoard: data.openaps?.iob.iob || data.loop?.iob.iob,
      pumpBattery: data.pump.battery?.percent,
      timestamp: new Date(data.created_at).getTime(),
    };
  },
};
