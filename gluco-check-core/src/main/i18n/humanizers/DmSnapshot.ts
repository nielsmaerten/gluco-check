import {DmMetric} from '../../../types/DmMetric';
import DmSnapshot from '../../../types/DmSnapshot';
import FormatParams from '../../../types/FormatParams';
import Humanizer from '.';

export default function (snapshot: DmSnapshot): Promise<string[]> {
  // For each requested metric:
  const promises = snapshot.query.metrics

    // 1. add sayTimeAgo and sayMetricName
    .map((metric, index) => addMetadata(snapshot, metric, index))

    // 2. turn into a humanize string
    .map(humanize);

  return Promise.all(promises);
}

function addMetadata(snapshot: DmSnapshot, metric: DmMetric, index: number) {
  return {
    metric,
    snapshot,
    locale: snapshot.query.locale,
    // timestamp is only said on the first metric
    sayTimeAgo: index === 0,
    // metric names are suppressed for single-metric queries
    sayMetricName: snapshot.query.metrics.length > 1,
  };
}

function humanize(params: FormatParams): Promise<string> {
  switch (params.metric) {
    case DmMetric.BloodSugar:
      return Humanizer.bloodSugar(params);

    case DmMetric.CannulaAge:
      return Humanizer.cannulaAge(params);

    case DmMetric.CarbsOnBoard:
      return Humanizer.carbsOnBoard(params);

    case DmMetric.InsulinOnBoard:
      return Humanizer.insulinOnBoard(params);

    case DmMetric.SensorAge:
      return Humanizer.sensorAge(params);

    case DmMetric.PumpBattery:
      return Humanizer.pumpBattery(params);

    case DmMetric.PumpReservoir:
      return Humanizer.pumpReservoir(params);

    default:
      throw new Error('Unable to humanize metric ' + params.metric);
  }
}
