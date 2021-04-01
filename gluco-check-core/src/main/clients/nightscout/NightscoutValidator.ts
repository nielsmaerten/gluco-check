import {URL} from 'url';
import axios from 'axios';
import NightscoutClient from './NightscoutClient';
import NightscoutValidationResult from '../../../types/NightscoutValidationResult';
import {DmMetric} from '../../../types/DmMetric';
import {logger} from 'firebase-functions';
import NightscoutProps from '../../../types/NightscoutProps';
import DmSnapshot from '../../../types/DmSnapshot';
import TokenValidator from './TokenValidator';
import {isSemanticVersion} from '../../utils';
const logTag = '[NightscoutValidator]';

export default class NightscoutValidator {
  public static async validate(client: NightscoutClient) {
    const result = new NightscoutValidationResult();
    const {token, url} = client.getNightscoutProps();

    // VALIDATION 1: Is URL pointing to a Nightscout instance?
    const urlValidationResult = await this.validateUrl(url);
    const parsedUrl = urlValidationResult.url.parsed;
    Object.assign(result, urlValidationResult);
    if (!result.url.pointsToNightscout) return result;

    // VALIDATION 2: If Nightscout detected: verify token's permissions
    const tokenValidator = new TokenValidator(token, parsedUrl);
    const tokenValidationResult = await tokenValidator.validate();
    const parsedToken = tokenValidationResult.token?.parsed;
    Object.assign(result, tokenValidationResult);

    // VALIDATION 3: Which METRICS are available?
    const metricsValidationResult = await this.validateMetrics(parsedUrl, parsedToken);
    Object.assign(result, metricsValidationResult);

    return result;
  }

  private static async validateMetrics(url: string, token?: string) {
    const client = new NightscoutClient(new NightscoutProps(url, token));
    return {
      discoveredMetrics: await this.getReadableMetrics(client),
    };
  }

  private static async validateUrl(input: string) {
    const {parsed, isValid} = this.getBaseUrl(input);
    const pointsToNightscout = await this.pointsToNightscout(parsed);
    return {
      url: {
        parsed,
        isValid,
        pointsToNightscout,
      },
    };
  }

  private static async pointsToNightscout(url: string): Promise<boolean> {
    // Attempt 1/3: v3 API
    // This test does not require a token: /version is public
    // It may fail if the Nightscout version is outdated
    logger.info(logTag, 'Attempting to detect v3 API @', url);
    try {
      const response = await axios.get(`${url}/api/v3/version`);
      const data = response.data;
      const hasVersion = data.version && isSemanticVersion(data.version);
      if (hasVersion) return true;
    } catch (e) {
      logger.info(logTag, url, 'did not support v3 Nightscout API', e);
    }

    // Attempt 2/3: v1 API
    // May fail if AUTH_DEFAULT_ROLES is set to 'denied'
    logger.info(logTag, 'Attempting to detect v1 API @', url);
    try {
      const response = await axios.get(`${url}/api/v1/status`);
      const data = response.data;
      const hasVersion = data.version && isSemanticVersion(data.version);
      if (hasVersion) return true;
    } catch (e) {
      logger.info(logTag, url, 'did not support v1 Nightscout API', e);
    }

    // Attempt 3/3: Index page
    logger.info(logTag, 'Attempting to detect a Nightscout page @', url);
    try {
      const response = await axios.get(url);
      const html = String(response.data);
      if (html.includes('<title>Nightscout</title>')) return true;
    } catch (e) {
      logger.info(logTag, 'HTTP GET failed @', url, e);
    }

    logger.info(logTag, 'All attempts to detect Nightscout failed @', url);
    return false;
  }

  private static getBaseUrl(_url: string): {parsed: string; isValid: boolean} {
    try {
      let url = _url.toLowerCase().trim();

      const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
      if (!hasProtocol) url = `http://${url}`;

      const parsedUrl = new URL(url);
      const hasTld = parsedUrl.hostname.includes('.');
      if (!hasTld) throw new Error('Url must include a dot (.)');

      return {
        parsed: parsedUrl.origin,
        isValid: true,
      };
    } catch (error) {
      return {
        parsed: error,
        isValid: false,
      };
    }
  }

  private static async getReadableMetrics(client: NightscoutClient) {
    // Get all metrics except "everything"
    const allMetrics = Object.values(DmMetric).filter(m => m !== DmMetric.Everything);

    // Run queries for every metric
    const promises = allMetrics.map(async metric => client.getMetric(metric));
    const partialSnapshots = await Promise.all(promises);
    const snapshot: DmSnapshot = Object.assign({}, ...partialSnapshots);

    // A metric is readable if its property is truthy or 0
    type metricTuple = [DmMetric, number?];
    const isReadable = (tuple: metricTuple) => tuple[1] || tuple[1] === 0;

    const tuples: metricTuple[] = [
      [DmMetric.PumpBattery, snapshot.pumpBattery],
      [DmMetric.SensorAge, snapshot.sensorInserted],
      [DmMetric.CarbsOnBoard, snapshot.carbsOnBoard],
      [DmMetric.CannulaAge, snapshot.cannulaInserted],
      [DmMetric.BloodSugar, snapshot.glucoseValueMgDl],
      [DmMetric.PumpReservoir, snapshot.pumpReservoir],
      [DmMetric.InsulinOnBoard, snapshot.insulinOnBoard],
    ];

    // Return all metrics that have a readable property
    const readableMetrics = tuples.filter(isReadable).map(tuple => tuple[0]);
    return readableMetrics;
  }
}
