import {DmMetric} from '../../../../types/DmMetric';
import QueryConfig from './QueryConfig.base';

export const CarbsInsulinOnBoard: QueryConfig = {
  key: 'COB+IOB',
  metrics: [DmMetric.CarbsOnBoard, DmMetric.InsulinOnBoard],
  path: '/pebble',
  params: {},
  callback: (data: any) => { // eslint-disable-line
    return {
      carbsOnBoard: data.bgs[0]?.cob,
      insulinOnBoard: data.bgs[0]?.iob,
      timestamp: new Date(data.bgs[0]?.datetime).getTime() || null,
    };
  },
};
