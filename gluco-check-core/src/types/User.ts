import {DmMetric} from './DmMetric';
import NightscoutProps from './NightscoutProps';
import {GlucoseUnit} from './GlucoseUnit';

/**
 * This class is a representation of a user object in in Firestore
 */
export default class User {
  public userId!: string;
  public exists!: boolean;
  public heardDisclaimer?: boolean;
  public defaultMetrics?: DmMetric[];
  public nightscout?: NightscoutProps;
  public glucoseUnit?: GlucoseUnit;
}
