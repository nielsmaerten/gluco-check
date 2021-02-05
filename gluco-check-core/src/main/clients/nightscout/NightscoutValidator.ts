import {URL} from 'url';
import axios from 'axios';
import NightscoutClient from './NightscoutClient';
import NightscoutValidationResult from '../../../types/NightscoutValidationResult';
import {DmMetric} from '../../../types/DmMetric';
import {logger} from 'firebase-functions';
import NightscoutProps from '../../../types/NightscoutProps';
import {nightscoutMinVersion} from '../../constants';
import {flattenDeep, intersection} from '../../utils';
import DmSnapshot from '../../../types/DmSnapshot';
const logTag = '[NightscoutValidator]';

export default class NightscoutValidator {
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

  private static async validateToken(_token = '', url: string) {
    let token = _token.trim();
    if (token.startsWith(url)) {
      // Token was copied from Nightscout as a URL
      token = new URL(token).searchParams.get('token') || token;
    }

    logger.info(logTag, 'Attempting to access v1 API using token @', url);
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

      const permissionGroups = authorized ? authorized.permissionGroups : [];
      const permissions: string[] = flattenDeep(permissionGroups);
      const acceptedPermissions = ['api:*:read', '*:*:read', '*', '*:*', '*:*:*'];
      const hasReadPermission = intersection(acceptedPermissions, permissions).length > 0;

      // const permissionGroups: string[][] = authorized ? authorized.permissionGroups : [];
      // const hasReadPermission = permissionGroups.some(g => g.includes('api:*:read'));

      return {
        token: {isValid: hasReadPermission, parsed: token},
        nightscout: {
          minSupportedVersion: nightscoutMinVersion,
          glucoseUnit: settings.units,
          version: version,
        },
      };
    } catch {
      logger.warn(logTag, 'Unable to access API using token @', url);
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
    logger.info(logTag, 'Attempting to detect v3 API @', url);
    try {
      const response = await axios.get(`${url}/api/v3/version`);
      const data = response.data;
      const hasVersion = data.version && this.isSemanticVersion(data.version);
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
      const hasVersion = data.version && this.isSemanticVersion(data.version);
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
