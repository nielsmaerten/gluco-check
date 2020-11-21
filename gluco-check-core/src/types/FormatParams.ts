import {DmMetric} from './DmMetric';
import DmSnapshot from './DmSnapshot';

export default class FormatParams {
  public metric!: DmMetric;
  public snapshot!: DmSnapshot;
  public locale!: string;
  public sayTimeAgo = true;
  public sayMetricName = false;
}
