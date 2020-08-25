import {URL} from 'url';

export default class NightscoutProps {
  constructor(url: string, hashedApiSecret?: string, token?: string) {
    this.url = new URL(url);
    if (hashedApiSecret) {
      // TODO
    }
    if (token) {
      this.url.searchParams.set('token', token);
    }
  }
  public url!: URL;
  public hashedApiSecret?: string;
  public token?: string;
}
