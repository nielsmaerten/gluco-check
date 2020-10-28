// HTTP response cache can contain 'any' types
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, {AxiosRequestConfig} from 'axios';
import NightscoutProps from '../../types/NightscoutProps';
import {URL} from 'url';
import * as QueryConfig from './NightscoutClient-Queries';
import {DiabetesPointer} from '../../types/DiabetesPointer';
import {ErrorTypes} from '../../types/ErrorTypes';
import {logger} from 'firebase-functions';

/**
 * Provides methods for querying a Nightscout site
 */
export default class NightscoutClient {
  constructor(private nightscout: NightscoutProps) {
    logger.debug('[NightscoutClient]: Initializing for:', nightscout.url);
  }
  private cache: any = {};

  async getPointer(pointer: DiabetesPointer) {
    switch (pointer) {
      case DiabetesPointer.BloodSugar:
        return await this.runQuery(QueryConfig.BloodSugar);

      case DiabetesPointer.CarbsOnBoard:
      case DiabetesPointer.InsulinOnBoard:
      case DiabetesPointer.PumpBattery:
        return await this.runQuery(QueryConfig.DeviceStatus);

      case DiabetesPointer.SensorAge:
        return await this.runQuery(QueryConfig.SensorAge);

      case DiabetesPointer.CannulaAge:
        return await this.runQuery(QueryConfig.CannulaAge);

      default:
        throw `[NightscoutClient]: ${pointer} has no associated NightscoutQuery`;
    }
  }

  private async runQuery(query: any) {
    const {params, path, callback, key} = query;

    // Build query URL
    const url = new URL(path, this.nightscout.url);

    // Have we seen this query before?
    if (!this.cache[key]) {
      // Build query request
      const request: AxiosRequestConfig = {
        url: String(url),
        params: {
          now: Date.now(),
          token: this.nightscout.token,
          ...params,
        },
      };

      // Do HTTP call, store promise in cache
      const responsePromise = this.callNightscout(request);
      this.cache[key] = responsePromise;
    } else {
      logger.debug(`[NightscoutClient]: Using cached ${path}`);
    }

    // Extract requested data from response
    const response = await this.cache[key];
    return callback(response);
  }

  private async callNightscout(request: AxiosRequestConfig) {
    try {
      // Send request
      const response = await axios.request(request);

      // Check if response is valid
      if (response.status !== 200) {
        throw `[NightscoutClient]: Unexpected http response status: ${response.status}`;
      }
      if (response.data.length !== 1) {
        throw '[NightscoutClient]: Nightscout responses should have exactly 1 item.';
      }

      return response.data[0];

      // Handle errors
    } catch (error) {
      logger.warn(`Error querying Nightscout '${request.url}': ${error}`);
      if (error.response?.status === 401) {
        throw ErrorTypes.NightscoutUnauthorized;
      }

      throw ErrorTypes.NightscoutUnavailable;
    }
  }
}
