import {DiabetesPointer} from '../../../../types/DiabetesPointer';
import QueryConfig from './0.QueryConfig.base';

export const CannulaAge: QueryConfig = {
  key: 2,
  pointers: [DiabetesPointer.CannulaAge],
  path: '/api/v3/treatments',
  params: {eventType: 'Site Change', sort$desc: 'created_at', limit: 1},
  callback: (data: any) => { // eslint-disable-line
    return {
      cannulaInserted: new Date(data.created_at).getTime(),
    };
  },
};
