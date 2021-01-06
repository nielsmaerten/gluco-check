import {URL} from 'url';
import axios from 'axios';
import NightscoutClient from './NightscoutClient';
import NightscoutValidationResult from '../../../types/NightscoutValidationResult';
import {DmMetric} from '../../../types/DmMetric';
import {logger} from 'firebase-functions';
import NightscoutProps from '../../../types/NightscoutProps';
import {nightscoutMinVersion} from '../../constants';

export default class NightscoutValidator {
  private static logTag = '[NightscoutValidator]:';

  public static async validate(client: NightscoutClient) {
    const result = new NightscoutValidationResult();
    const input = client.getNightscoutProps();

    // VALIDATION 1: Is URL pointing to a Nightscout instance?
    const partialResult1 = await this.validateUrl(input.url);
    Object.assign(result, partialResult1);

    if (result.url.pointsToNightscout) {
      // VALIDATION 2: Does TOKEN have the required permissions?
      const partialResult2 = await this.validateToken(input.token, result.url.parsed);
      Object.assign(result, partialResult2);

      // VALIDATION 3: Which METRICS are available?
      const url = result.url.parsed;
      const token = result.token.parsed;
      const partialResult3 = await this.validateAPIs(url, token);
      Object.assign(result, partialResult3);
    }

    return result;
  }

  private static async validateAPIs(url: string, token: string) {
    const client = new NightscoutClient(new NightscoutProps(url, token));
    return {
      discoveredMetrics: await this.getReadableMetrics(client),
    };
  }

  private static async validateToken(_token: string | undefined, url: string) {
    // FIXME: Even when token is empty, we should still check ns version and units
    if (!_token) return {token: {isValid: false, parsed: ''}};
    const token = _token.trim();

    logger.info(this.logTag, 'Attempting to access v1 API using token @', url);
    try {
      // Fetch STATUS object
      const api = `${url}/api/v1/status`;
      const req = {
        url: api,
        params: {
          token: token,
        },
      };
      const response = await axios.request(req);

      // Extract permissions from STATUS object
      const {authorized, settings, version} = response.data;
      const permissionGroups: string[][] = authorized ? authorized.permissionGroups : [];

      // Check if 'api:*:read' is listed
      const hasReadPermission = permissionGroups.some(g => g.includes('api:*:read'));

      return {
        token: {isValid: hasReadPermission, parsed: token},
        nightscout: {
          minSupportedVersion: nightscoutMinVersion,
          glucoseUnit: settings.units,
          version: version,
        },
      };
    } catch {
      logger.warn(this.logTag, 'Unable to access API using token @', url);
    }

    return {
      token: {isValid: false, parsed: token},
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

  private static isSemanticVersion(input: string) {
    // Source: https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
    const regex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
    return regex.test(input);
  }

  private static async pointsToNightscout(url: string): Promise<boolean> {
    // Attempt 1/3: v3 API
    // This test does not require a token: /version is public
    // It may fail if the Nightscout version is outdated
    logger.info(this.logTag, 'Attempting to detect v3 API @', url);
    try {
      const response = await axios.get(`${url}/api/v3/version`);
      const data = response.data;
      const hasVersion = data.version && this.isSemanticVersion(data.version);
      if (hasVersion) return true;
    } catch (e) {
      logger.info(this.logTag, url, 'did not support v3 Nightscout API', e);
    }

    // Attempt 2/3: v1 API
    // May fail if AUTH_DEFAULT_ROLES is set to 'denied'
    logger.info(this.logTag, 'Attempting to detect v1 API @', url);
    try {
      const response = await axios.get(`${url}/api/v1/status`);
      const data = response.data;
      const hasVersion = data.version && this.isSemanticVersion(data.version);
      if (hasVersion) return true;
    } catch (e) {
      logger.info(this.logTag, url, 'did not support v1 Nightscout API', e);
    }

    // Attempt 3/3: Index page
    logger.info(this.logTag, 'Attempting to detect a Nightscout page @', url);
    try {
      const response = await axios.get(url);
      const html = String(response.data);
      if (html.includes('<title>Nightscout</title>')) return true;
    } catch (e) {
      logger.info(this.logTag, 'HTTP GET failed @', url, e);
    }

    logger.info(this.logTag, 'all attempts to detect Nightscout failed @', url);
    return false;
  }

  private static getBaseUrl(_url: string): {parsed: string; isValid: boolean} {
    try {
      const url = _url.toLowerCase().trim();

      const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
      if (!hasProtocol) throw 'Url must start with http:// or https://';

      const parsedUrl = new URL(url);
      const hasTld = parsedUrl.hostname.includes('.');
      if (!hasTld) throw 'Url must include a dot (.)';

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
    const snapshot = Object.assign({}, ...partialSnapshots);

    // A metric is readable if its corresponding property is defined
    const readableMetrics = [];
    if (snapshot.cannulaInserted) readableMetrics.push(DmMetric.CannulaAge);
    if (snapshot.carbsOnBoard) readableMetrics.push(DmMetric.CarbsOnBoard);
    if (snapshot.glucoseValueMgDl) readableMetrics.push(DmMetric.BloodSugar);
    if (snapshot.insulinOnBoard) readableMetrics.push(DmMetric.InsulinOnBoard);
    if (snapshot.pumpBattery) readableMetrics.push(DmMetric.PumpBattery);
    if (snapshot.pumpReservoir) readableMetrics.push(DmMetric.PumpReservoir);
    if (snapshot.sensorInserted) readableMetrics.push(DmMetric.SensorAge);

    return readableMetrics;
  }
}
