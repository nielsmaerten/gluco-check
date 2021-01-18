/* eslint-disable @typescript-eslint/no-explicit-any */ /* HTTP responses are of type 'any' */
import axios, {AxiosRequestConfig} from 'axios';
import NightscoutProps from '../../../types/NightscoutProps';
import {URL} from 'url';
import * as QueryConfigs from './queries';
import {DmMetric} from '../../../types/DmMetric';
import {ErrorType} from '../../../types/ErrorType';
import {logger} from 'firebase-functions';
import QueryConfig from './queries/QueryConfig.base';
import DmSnapshot from '../../../types/DmSnapshot';
import NightscoutValidator from './NightscoutValidator';
const logTag = '[NightscoutClient]';

/**
 * Provides methods for querying a Nightscout site
 */
export default class NightscoutClient {
  constructor(private nightscoutProps: NightscoutProps) {
    logger.debug(logTag, 'Initializing for:', nightscoutProps.url);
  }
  private cache: any = {};

  async getMetric(metric: DmMetric): Promise<Partial<DmSnapshot>> {
    const queryConfig = this.findQueryConfigFor(metric);
    return this.runQuery(queryConfig);
  }

  /**
   * Finds a QueryConfig that can be used to fetch the requestedMetric
   * @param requestedMetric The metric you'd like to get from Nightscout
   */
  private findQueryConfigFor(requestedMetric: DmMetric) {
    for (const [, queryConfig] of Object.entries(QueryConfigs)) {
      const canFetchMetric = queryConfig.metrics.includes(requestedMetric);
      if (canFetchMetric) return queryConfig;
    }
    /* istanbul ignore next */
    throw new Error(
      `${logTag} Unable to find a NightscoutQuery that can fetch ${requestedMetric}`
    );
  }

  private async runQuery(query: QueryConfig): Promise<Partial<DmSnapshot>> {
    const {params, path, callback, key, metrics} = query;

    // Build the URL for this Query
    const url = new URL(path, this.nightscoutProps.url);

    // Have we seen this query before?
    const inCache = !!this.cache[key];

    // ...Yes: skip the HTTP request
    if (inCache) {
      logger.debug(logTag, `Using cached ${path}`);
    }

    // ...No: send HTTP request
    else {
      logger.debug(logTag, 'Querying', path);
      const request: AxiosRequestConfig = {
        url: String(url),
        timeout: 4000,
        params: {
          now: Date.now(),
          token: this.nightscoutProps.token,
          ...params,
        },
      };

      // Send HTTP request and store promise in cache
      const responsePromise = this.callNightscout(request);
      this.cache[key] = responsePromise;
    }

    try {
      // Wait for the http call to resolve
      const response = await this.cache[key];

      // Abort if no data
      if (!response) throw {type: ErrorType.QueryResponse_MetricNotFound};

      // Use the query's callback fn to extract the data we want
      return callback(response);

      // Handle HTTP errors
    } catch (error) {
      return this.createSnapshotWithErrors(error, metrics);
    }
  }

  private async callNightscout(request: AxiosRequestConfig) {
    try {
      // Send request, await response
      const response = await axios.request(request);

      if (response.data?.length) return response.data[0];
      else if (response.data) return response.data;
      else return null;

      // Handle errors
    } catch (error) {
      // Internal error: Re-throw
      if (!error.isAxiosError) throw error;

      // Axios error (401, timeout, network failure, ...)
      const is401error = error.response?.status === 401;
      throw {
        request,
        response: error.response,
        type: is401error
          ? ErrorType.Nightscout_Unauthorized
          : ErrorType.Nightscout_Unavailable,
      };
    }
  }

  private createSnapshotWithErrors(
    error: {type: ErrorType},
    metrics: DmMetric[]
  ): Partial<DmSnapshot> {
    switch (error.type) {
      case ErrorType.Nightscout_Unauthorized:
        logger.warn(logTag, 'UNAUTHORIZED. Verify a valid token was provided.');
        break;

      case ErrorType.Nightscout_Unavailable:
        logger.warn(logTag, 'UNAVAILABLE. Verify the Nightscout URL');
        break;

      case ErrorType.QueryResponse_MetricNotFound:
        logger.warn(logTag, `Query for [${metrics}] returned no data`);
        break;

      default:
        logger.error(logTag, `Query for ${metrics} resulted in unexpected ${error}`);
        break;
    }

    const snapshotWithErrors = {
      errors: metrics.map(p => {
        return {
          type: error.type,
          affectedMetric: p,
        };
      }),
    };

    return snapshotWithErrors;
  }

  public getNightscoutProps() {
    return this.nightscoutProps;
  }

  public async validate() {
    return NightscoutValidator.validate(this);
  }
}
