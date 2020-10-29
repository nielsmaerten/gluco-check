/* eslint-disable @typescript-eslint/no-explicit-any */ /* HTTP responses are of type 'any' */
import axios, {AxiosRequestConfig} from 'axios';
import NightscoutProps from '../../../types/NightscoutProps';
import {URL} from 'url';
import * as Queries from './queries';
import {DiabetesPointer} from '../../../types/DiabetesPointer';
import {ErrorTypes} from '../../../types/ErrorTypes';
import {logger} from 'firebase-functions';
import QueryConfig from './queries/0.QueryConfig.base';
import DiabetesSnapshot from '../../../types/DiabetesSnapshot';

/**
 * Provides methods for querying a Nightscout site
 */
export default class NightscoutClient {
  constructor(private nightscout: NightscoutProps) {
    logger.debug('[NightscoutClient]: Initializing for:', nightscout.url);
  }
  private cache: any = {};

  async getPointer(pointer: DiabetesPointer): Promise<Partial<DiabetesSnapshot>> {
    switch (pointer) {
      case DiabetesPointer.BloodSugar:
        return await this.runQuery(Queries.BloodSugar);

      case DiabetesPointer.CarbsOnBoard:
      case DiabetesPointer.InsulinOnBoard:
      case DiabetesPointer.PumpBattery:
        return await this.runQuery(Queries.DeviceStatus);

      case DiabetesPointer.SensorAge:
        return await this.runQuery(Queries.SensorAge);

      case DiabetesPointer.CannulaAge:
        return await this.runQuery(Queries.CannulaAge);

      default:
        throw new Error(
          `[NightscoutClient]: ${pointer} has no associated NightscoutQuery`
        );
    }
  }

  private async runQuery(query: QueryConfig): Promise<Partial<DiabetesSnapshot>> {
    const {params, path, callback, key, pointers} = query;

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
      return this.createSnapshotWithErrors(error, pointers);
    }
  }

  private async callNightscout(request: AxiosRequestConfig) {
    try {
      // Send request, await response
      const response = await axios.request(request);

      // Response must have exactly 1 item
      if (response.data?.length !== 1) {
        throw {type: ErrorTypes.Nightscout_UnexpectedNrOfItems, request, response};
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
            ? ErrorTypes.Nightscout_Unauthorized
            : ErrorTypes.Nightscout_Unavailable,
        request,
        response: error.response,
      };
    }
  }

  private createSnapshotWithErrors(
    error: {type: ErrorTypes},
    pointers: DiabetesPointer[]
  ): Partial<DiabetesSnapshot> {
    switch (error.type) {
      case ErrorTypes.Nightscout_Unauthorized:
        logger.warn(
          '[NightscoutClient]: UNAUTHORIZED. Verify a valid token was provided.'
        );
        break;

      case ErrorTypes.Nightscout_Unavailable:
        logger.warn('[NightscoutClient]: UNAVAILABLE. Verify the Nightscout URL');
        break;

      case ErrorTypes.Nightscout_UnexpectedNrOfItems:
        logger.error(
          "[NightscoutClient]: Unexpected nr of items. This shouldn't happen!"
        );
        break;

      default:
        logger.error(
          `[NightscoutClient]: Query for ${pointers} resulted in unexpected ${error}`
        );
        break;
    }

    const snapshotWithErrors = {
      errors: pointers.map(p => {
        return {
          type: error.type,
          affectedPointer: p,
        };
      }),
    };

    return snapshotWithErrors;
  }
}
