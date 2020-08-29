/* eslint-disable @typescript-eslint/no-explicit-any */

/// <reference lib="DOM" />
// FIXME: Upgrade Axios to remove ref to DOM
// Bug: https://github.com/axios/axios/issues/3219

import axios, {AxiosRequestConfig} from 'axios';
import NightscoutProps from '../../types/NightscoutProps';
import {URL} from 'url';
import {BloodSugar, CannulaAge, SensorAge, DeviceStatus} from './NightscoutQueries';
import {DiabetesPointer} from '../../types/DiabetesPointer';
import {ErrorTypes} from '../../types/ErrorTypes';

export default class NightscoutClient {
  constructor(private nightscout: NightscoutProps) {}
  private cache: any = {};

  async getPointer(pointer: DiabetesPointer) {
    switch (pointer) {
      case DiabetesPointer.BloodSugar:
        return await this.doApiCall(BloodSugar);

      case DiabetesPointer.CarbsOnBoard:
      case DiabetesPointer.InsulinOnBoard:
        return await this.doApiCall(DeviceStatus);

      case DiabetesPointer.SensorAge:
        return await this.doApiCall(SensorAge);

      case DiabetesPointer.CannulaAge:
        return await this.doApiCall(CannulaAge);

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
        token: !this.nightscout.token ? undefined : this.nightscout.token,
        ...query.params,
      },
    };

    try {
      // Send request
      const response = await axios.request(request);

      // Inspect response
      if (response.status === 200) {
        const data = response.data[0];
        this.cache[query.path] = data;
        return query.callback(data);
      }

      // Handle errors
    } catch (error) {
      if (error.response?.status === 401) {
        throw ErrorTypes.NightscoutUnauthorized;
      }

      throw ErrorTypes.NightscoutUnavailable;
    }
  }
}
