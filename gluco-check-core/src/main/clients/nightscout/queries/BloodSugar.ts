import {DmMetric} from '../../../../types/DmMetric';
import {GlucoseTrend} from '../../../../types/GlucoseTrend';
import QueryConfig from './QueryConfig.base';

export const BloodSugar: QueryConfig = {
  key: 'BG',
  metrics: [DmMetric.BloodSugar],
  path: '/api/v1/entries/current',
  params: {},
  callback: (data: any) => { // eslint-disable-line
    return {
      glucoseTrend: parseNightscoutTrend(data.direction),
      glucoseValueMgDl: data.sgv || data.mbg || data.cal || data.etc,
      timestamp: data.date,
    };
  },
};

function parseNightscoutTrend(trend: string): GlucoseTrend {
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
