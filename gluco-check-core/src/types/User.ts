import {DiabetesPointer} from './DiabetesPointer';
import NightscoutProps from './NightscoutProps';

export default class User {
  public userId!: string;
  public exists!: boolean;
  public defaultPointers?: DiabetesPointer[];
  public nightscout?: NightscoutProps;
}
