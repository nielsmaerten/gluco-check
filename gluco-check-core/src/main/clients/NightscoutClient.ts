// HTTP response cache can contain 'any' types
/* eslint-disable @typescript-eslint/no-explicit-any */

// FIXME: Required because of: https://github.com/axios/axios/issues/3219
/// <reference lib="DOM" />

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
    logger.debug('Initializing a NightscoutClient for:', nightscout.url);
  }
  private cache: any = {};

  async getPointer(pointer: DiabetesPointer) {
    logger.debug(`Querying Nightscout for: ${pointer}`);
    switch (pointer) {
      case DiabetesPointer.BloodSugar:
        return await this.doApiCall(QueryConfig.BloodSugar);

      case DiabetesPointer.CarbsOnBoard:
      case DiabetesPointer.InsulinOnBoard:
      case DiabetesPointer.PumpBattery:
        return await this.doApiCall(QueryConfig.DeviceStatus);

      case DiabetesPointer.SensorAge:
        return await this.doApiCall(QueryConfig.SensorAge);

      case DiabetesPointer.CannulaAge:
        return await this.doApiCall(QueryConfig.CannulaAge);

      default:
        throw `${pointer} has no associated NightscoutQuery`;
    }
  }

  private async doApiCall(query: any) {
    // Build URL
    const url = new URL(query.path, this.nightscout.url);
    if (this.cache[query.path]) return this.cache[query.path];

    // Build request
    const request: AxiosRequestConfig = {
      url: url.toString(),
      params: {
        now: Date.now(),
        limit: 1,
        token: !this.nightscout.token ? undefined : this.nightscout.token,
        ...query.params,
      },
    };

    try {
      // Send request
      logger.debug('Nightscout Request:', request);
      const response = await axios.request(request);
      logger.debug('Nightscout Response:', response.data);

      // Inspect response
      if (response.status === 200) {
        const data = response.data[0];
        this.cache[query.path] = data;
        return query.callback(data);
      }

      throw `Unexpected: Nightscout responded with ${response.status}`;

      // Handle errors
    } catch (error) {
      if (error.response?.status === 401) {
        throw ErrorTypes.NightscoutUnauthorized;
      }

      throw ErrorTypes.NightscoutUnavailable;
    }
  }
}
