import {DmMetric} from '../../../../types/DmMetric';
import QueryConfig from './QueryConfig.base';

export const SensorAge: QueryConfig = {
  key: 'SAGE',
  metrics: [DmMetric.SensorAge],
  path: '/api/v3/treatments',
  params: {eventType: 'Sensor Change', sort$desc: 'created_at', limit: 1},
  callback: (data: any) => { // eslint-disable-line
    return {
      sensorInserted: new Date(data.created_at).getTime(),
    };
  },
};
