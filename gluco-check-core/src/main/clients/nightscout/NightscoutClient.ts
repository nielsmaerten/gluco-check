/* eslint-disable @typescript-eslint/no-explicit-any */ /* HTTP responses are of type 'any' */
import axios, {AxiosRequestConfig} from 'axios';
import NightscoutProps from '../../../types/NightscoutProps';
import {URL} from 'url';
import * as Queries from './queries';
import {DmMetric} from '../../../types/DmMetric';
import {ErrorType} from '../../../types/ErrorType';
import {logger} from 'firebase-functions';
import QueryConfig from './queries/QueryConfig.base';
import DmSnapshot from '../../../types/DmSnapshot';

/**
 * Provides methods for querying a Nightscout site
 */
export default class NightscoutClient {
  constructor(private nightscout: NightscoutProps) {
    logger.debug('[NightscoutClient]: Initializing for:', nightscout.url);
  }
  private cache: any = {};

  async getMetric(metric: DmMetric): Promise<Partial<DmSnapshot>> {
    switch (metric) {
      case DmMetric.BloodSugar:
        return await this.runQuery(Queries.BloodSugar);

      case DmMetric.CarbsOnBoard:
      case DmMetric.InsulinOnBoard:
      case DmMetric.PumpBattery:
        return await this.runQuery(Queries.DeviceStatus);

      case DmMetric.SensorAge:
        return await this.runQuery(Queries.SensorAge);

      case DmMetric.CannulaAge:
        return await this.runQuery(Queries.CannulaAge);

      default:
        throw new Error(
          `[NightscoutClient]: ${metric} has no associated NightscoutQuery`
        );
    }
  }

  private async runQuery(query: QueryConfig): Promise<Partial<DmSnapshot>> {
    const {params, path, callback, key, metrics} = query;

    // Build the URL for this Query
    const url = new URL(path, this.nightscout.url);

    // Have we seen this query before?
    const inCache = !!this.cache[key];

    // ...Yes: skip the HTTP request
    if (inCache) {
      logger.debug(`[NightscoutClient]: Using cached ${path}`);
    }

    // ...No: send HTTP request
    else {
      const request: AxiosRequestConfig = {
        url: String(url),
        timeout: 4000,
        params: {
          now: Date.now(),
          token: this.nightscout.token,
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

      // Response must have exactly 1 item
      if (response.data?.length !== 1) {
        throw {type: ErrorType.Nightscout_UnexpectedNrOfItems, request, response};
      }

      // If we got here, everything's fine
      return response.data[0];

      // Handle errors
    } catch (error) {
      // Internal error: Re-throw
      if (!error.isAxiosError) throw error;

      // Axios error (401, timeout, network failure, ...)
      throw {
        type:
          error.response?.status === 401
            ? ErrorType.Nightscout_Unauthorized
            : ErrorType.Nightscout_Unavailable,
        request,
        response: error.response,
      };
    }
  }

  private createSnapshotWithErrors(
    error: {type: ErrorType},
    metrics: DmMetric[]
  ): Partial<DmSnapshot> {
    switch (error.type) {
      case ErrorType.Nightscout_Unauthorized:
        logger.warn(
          '[NightscoutClient]: UNAUTHORIZED. Verify a valid token was provided.'
        );
        break;

      case ErrorType.Nightscout_Unavailable:
        logger.warn('[NightscoutClient]: UNAVAILABLE. Verify the Nightscout URL');
        break;

      case ErrorType.Nightscout_UnexpectedNrOfItems:
        logger.error(
          "[NightscoutClient]: Unexpected nr of items. This shouldn't happen!"
        );
        break;

      default:
        logger.error(
          `[NightscoutClient]: Query for ${metrics} resulted in unexpected ${error}`
        );
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
}
