import {DiabetesPointer} from './DiabetesPointer';
import NightscoutProps from './NightscoutProps';
import {GlucoseUnit} from './GlucoseUnit';

export default class User {
  public userId!: string;
  public exists!: boolean;
  public defaultPointers?: DiabetesPointer[];
  public nightscout?: NightscoutProps;
  public glucoseUnit?: GlucoseUnit;
}
