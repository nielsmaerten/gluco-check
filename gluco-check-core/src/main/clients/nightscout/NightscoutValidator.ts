import {URL} from 'url';
import axios from 'axios';
import NightscoutClient from './NightscoutClient';
import NightscoutValidationResult from '../../../types/NightscoutValidationResult';
import {DmMetric} from '../../../types/DmMetric';
import NightscoutProps from '../../../types/NightscoutProps';
import {ErrorType} from '../../../types/ErrorType';

export default class NightscoutValidator {
  public static async validate(client: NightscoutClient) {
    // New result with default values. We'll update this as we're validating
    const {url, token} = client.getNightscoutProps();
    const globalResult: NightscoutValidationResult = {
      glucoseUnit: 'N/A',
      version: 'N/A',
      readableMetrics: [],
      canReadStatus: false,
      tokenIsValid: false,
      urlIsValid: false,
      parsedUrl: 'N/A',
      parsedToken: token?.trim() || 'N/A',
    };

    // Try parsing the URL
    const urlValidationResult = this.getBaseUrl(url);

    // Update globalResult with parsed URL, bail if invalid
    Object.assign(globalResult, urlValidationResult);
    if (!globalResult.urlIsValid) return globalResult;

    // From the parsed url, build a new NightscoutClient
    const newProps = new NightscoutProps(globalResult.parsedUrl, token?.trim());
    const newClient = new NightscoutClient(newProps);

    // Try reading status endpoint
    const statusValidationResult = await this.querySiteStatus(
      newProps.url,
      newProps.token
    );
    Object.assign(globalResult, statusValidationResult);

    // Try reading all metrics
    const metricsValidationResult = await this.getReadableMetrics(newClient);
    Object.assign(globalResult, metricsValidationResult);

    return globalResult;
  }

  private static getBaseUrl(_url: string): {parsedUrl: string; urlIsValid: boolean} {
    try {
      const url = _url.toLowerCase().trim();

      const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
      if (!hasProtocol) throw 'Url must start with http:// or https://';

      const parsedUrl = new URL(url);
      const hasTld = parsedUrl.hostname.includes('.');
      if (!hasTld) throw 'Url must include a dot (.)';

      return {
        parsedUrl: parsedUrl.origin,
        urlIsValid: true,
      };
    } catch (error) {
      return {
        parsedUrl: error,
        urlIsValid: false,
      };
    }
  }

  private static async querySiteStatus(baseUrl: string, token?: string) {
    const queryString = token ? `?token=${token}` : '';
    const endpoint = `${baseUrl}/api/v1/status.json${queryString}`;
    try {
      const axiosResponse = (await axios.get(endpoint)).data;
      return {
        canReadStatus: String(axiosResponse.status).toLowerCase() === 'ok',
        version: axiosResponse.version,
        glucoseUnit: axiosResponse.settings?.units,
      };
    } catch (error) {
      return {canReadStatus: false};
    }
  }

  private static async getReadableMetrics(client: NightscoutClient) {
    // Test all metrics except "everything"
    const allMetrics = Object.values(DmMetric).filter(m => m !== DmMetric.Everything);

    // For each metric, check if we can read it
    const promises = allMetrics.map(async m => this.isMetricReadable(client, m));
    const results = await Promise.all(promises);

    // Return all metrics that succeeded, and if any returned a token error
    const readableMetrics = results.filter(r => r.isReadable).map(r => r.metric);
    const tokenIsValid = readableMetrics.length > 0 && results.every(r => r.tokenIsValid);
    return {
      readableMetrics,
      tokenIsValid,
    };
  }

  private static async isMetricReadable(client: NightscoutClient, metric: DmMetric) {
    const result = await client.getMetric(metric);
    const isReadable = !result.errors || result.errors.length === 0;
    const tokenIsValid =
      !result.errors ||
      !result.errors.some(e => e.type === ErrorType.Nightscout_Unauthorized);
    return {metric, isReadable, tokenIsValid};
  }
}
