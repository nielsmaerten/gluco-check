import {DmMetric} from './DmMetric';

export default class NightscoutValidationResult {
  public urlIsValid = false;
  public tokenIsValid = false;
  public canReadStatus = false;
  public readableMetrics: DmMetric[] = [];
  public version = '';
  public glucoseUnit = '';
  public parsedUrl = '';
  public parsedToken = '';
}
