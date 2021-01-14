import {DmMetric} from '../../../../types/DmMetric';
import QueryConfig from './QueryConfig.base';

export const PumpStatus: QueryConfig = {
  key: 'PB+PR',
  metrics: [DmMetric.PumpBattery, DmMetric.PumpReservoir],
  path: '/api/v3/devicestatus',
  params: {sort$desc: 'created_at', limit: 1, 'pump.clock$gte': ''},
  callback: (data: any) => { // eslint-disable-line
    return {
      pumpBattery: data.pump?.battery?.percent,
      pumpReservoir: data.pump?.reservoir,
      timestamp: new Date(data.created_at).getTime(),
    };
  },
};
