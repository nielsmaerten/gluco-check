import {DiabetesPointer} from '../../../../types/DiabetesPointer';
import QueryConfig from './0.QueryConfig.base';

export const SensorAge: QueryConfig = {
  key: 3,
  pointers: [DiabetesPointer.SensorAge],
  path: '/api/v3/treatments',
  params: {eventType: 'Sensor Change', sort$desc: 'created_at', limit: 1},
  callback: (data: any) => { // eslint-disable-line
    return {
      sensorInserted: new Date(data.created_at).getTime(),
    };
  },
};
