import {DiabetesPointer} from './DiabetesPointer';
import NightscoutProps from './NightscoutProps';
import {GlucoseUnit} from './GlucoseUnit';

/**
 * This class is a representation of a user object in in Firestore
 */
export default class User {
  public userId!: string;
  public exists!: boolean;
  public defaultPointers?: DiabetesPointer[];
  public nightscout?: NightscoutProps;
  public glucoseUnit?: GlucoseUnit;
}
