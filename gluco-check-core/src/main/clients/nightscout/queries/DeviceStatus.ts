import {DmMetric} from '../../../../types/DmMetric';
import QueryConfig from './QueryConfig.base';

export const DeviceStatus: QueryConfig = {
  key: 'DS',
  metrics: [
    DmMetric.CarbsOnBoard,
    DmMetric.InsulinOnBoard,
    DmMetric.PumpBattery,
    DmMetric.PumpReservoir,
  ],
  path: '/api/v3/devicestatus',
  params: {sort$desc: 'created_at', limit: 1, 'pump.clock$gte': ''},
  callback: (data: any) => { // eslint-disable-line
    return {
      carbsOnBoard: data.openaps?.suggested?.COB || data.loop?.cob.cob,
      insulinOnBoard: data.openaps?.iob.iob || data.loop?.iob.iob,
      pumpBattery: data.pump.battery?.percent,
      pumpReservoir: data.pump.reservoir,
      timestamp: new Date(data.created_at).getTime(),
    };
  },
};
