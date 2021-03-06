import {DmMetric} from '../../../../types/DmMetric';
import QueryConfig from './QueryConfig.base';

export const CannulaAge: QueryConfig = {
  key: 'CAGE',
  metrics: [DmMetric.CannulaAge],
  path: '/api/v3/treatments',
  params: {eventType: 'Site Change', sort$desc: 'created_at', limit: 1},
  callback: (data: any) => { // eslint-disable-line
    return {
      cannulaInserted: new Date(data.created_at).getTime() || null,
    };
  },
};
