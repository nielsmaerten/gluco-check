import {URL} from 'url';

export default class NightscoutProps {
  constructor(private _url: string, private _token?: string) {}

  get url(): string {
    return this._url;
  }

  get token(): string | undefined {
    return this._token;
  }

  get hasValidUrl(): boolean {
    try {
      new URL(this._url);
      return true;
    } catch (error) {
      return false;
    }
  }
}
