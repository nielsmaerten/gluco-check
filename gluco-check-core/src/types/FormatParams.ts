import {DiabetesPointer} from './DiabetesPointer';
import DiabetesSnapshot from './DiabetesSnapshot';

export default class FormatParams {
  public pointer!: DiabetesPointer;
  public snapshot!: DiabetesSnapshot;
  public locale!: string;
  public sayTimeAgo = true;
  public sayPointerName = false;
}
