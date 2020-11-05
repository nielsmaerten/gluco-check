import {DiabetesPointer} from '../../../../types/DiabetesPointer';
import QueryConfig from './QueryConfig.base';

export const CannulaAge: QueryConfig = {
  key: 'CAGE',
  pointers: [DiabetesPointer.CannulaAge],
  path: '/api/v3/treatments',
  params: {eventType: 'Site Change', sort$desc: 'created_at', limit: 1},
  callback: (data: any) => { // eslint-disable-line
    return {
      cannulaInserted: new Date(data.created_at).getTime(),
    };
  },
};
