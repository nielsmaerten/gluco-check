import DiabetesSnapshot from "./DiabetesSnapshot";

export default class FormatParams {
    public snapshot!: DiabetesSnapshot;
    public locale!: string;
    public sayTimeAgo: boolean = true;
    public sayPointerName: boolean = false;
  }
  