import {DmMetric} from '../../../../types/DmMetric';
import {GlucoseTrend} from '../../../../types/GlucoseTrend';
import QueryConfig from './QueryConfig.base';

export const Pebble: QueryConfig = {
  key: 'BG+COB+IOB',
  metrics: [DmMetric.BloodSugar, DmMetric.CarbsOnBoard, DmMetric.InsulinOnBoard],
  path: '/pebble',
  params: {},
  callback: (data: any) => { // eslint-disable-line
    const bgs = data.bgs[0];
    const {sgv, mbg, cal, etc} = bgs;
    const {iob, cob} = bgs;
    const {datetime} = bgs;
    return {
      glucoseTrend: parseNightscoutTrend(bgs.direction),
      glucoseValueMgDl: parseFloat(sgv || mbg || cal || etc),
      carbsOnBoard: cob,
      insulinOnBoard: iob,
      timestamp: new Date(datetime).getTime(),
    };
  },
};

function parseNightscoutTrend(trend: string): GlucoseTrend {
  /* istanbul ignore next: if 1 works, they should all work */
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
