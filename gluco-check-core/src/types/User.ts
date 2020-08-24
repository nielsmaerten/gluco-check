import {DiabetesPointer} from './DiabetesPointer';

export default class User {
  public userId!: string;
  public exists!: boolean;
  public defaultPointers?: DiabetesPointer[];
}
