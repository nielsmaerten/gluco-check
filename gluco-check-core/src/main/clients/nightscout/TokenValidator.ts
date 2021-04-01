import axios, {AxiosRequestConfig} from 'axios';
import {logger} from 'firebase-functions';
import {URL} from 'url';
import {GlucoseUnit} from '../../../types/GlucoseUnit';
import NightscoutValidationResult from '../../../types/NightscoutValidationResult';
import {nightscoutMinVersion} from '../../constants';
import {flattenDeep, intersection} from '../../utils';
import TokenCreator from './TokenCreator';
const logTag = '[TokenValidator]';

type StatusResponse = {
  authorized: {
    permissionGroups: string[][];
  };
  settings: {
    units: GlucoseUnit;
  };
  version: string;
};

export default class TokenValidator {
  constructor(private token: string = '', private url: string) {
    // Trim whitespace from token
    this.token = this.token.trim();

    // In case token was entered as url, strip url part
    this.token = this.stripUrlToken();
  }

  /**
   * Checks whether the token has the required permissions.
   * If provided token is actually an api secret,
   * it will be converted to a token
   */
  public async validate() {
    try {
      logger.info(logTag, `Trying to access ${this.url} using provided token`);
      return this.validateToken();
    } catch {
      logger.info(logTag, 'Validation failed: unknown error');
      return {isValid: false, parsed: this.token} as Partial<NightscoutValidationResult>;
    }
  }

  /**
   * Internal validation function for tokens/api secrets
   */
  private async validateToken() {
    let statusResponse: StatusResponse;

    // Get the status of the current token
    statusResponse = await this.fetchStatusObject();
    const noValidToken = statusResponse.authorized === null;

    // If not a valid token, try using it as an api secret to create a new token
    if (noValidToken) {
      const tokenCreator = new TokenCreator(this.token, this.url);
      const newToken = await tokenCreator.create();
      if (newToken) {
        this.token = newToken;
        statusResponse = await this.fetchStatusObject();
      }
    }

    // Parse response and return result
    return this.buildValidationResult(statusResponse);
  }

  /**
   * Fetches /api/v1/status using the current token
   */
  private async fetchStatusObject() {
    // Build request
    const api = `${this.url}/api/v1/status`;
    const req: AxiosRequestConfig = {
      url: api,
      params: {
        token: this.token,
      },
    };

    // Extract response
    const response = await axios.request<StatusResponse>(req);
    return response.data;
  }

  private buildValidationResult(statusResponse: StatusResponse) {
    return {
      token: {
        isValid: checkPermissions(statusResponse),
        parsed: this.token,
      },
      nightscout: {
        version: statusResponse.version,
        glucoseUnit: statusResponse.settings?.units,
        minSupportedVersion: nightscoutMinVersion,
      },
    } as Partial<NightscoutValidationResult>;
  }

  /**
   * Extracts the token from a url.
   * This is for when a token gets entered in full-url form, like this:
   * https://cgm.example.com?token=glucocheck-abc123
   */
  private stripUrlToken() {
    if (this.token.startsWith(this.url)) {
      logger.info(logTag, 'Provided value is a url. Extracting token');
      return new URL(this.token).searchParams.get('token') || this.token;
    } else return this.token;
  }
}

/**
 * Validates if a StatusObject mentions the correct permissions
 */
function checkPermissions(status: StatusResponse): boolean {
  const {authorized} = status;
  if (authorized === null) {
    logger.info(logTag, 'Token validation failed.');
    return false;
  }

  const permissionGroups = authorized.permissionGroups || [];
  const permissions: string[] = flattenDeep(permissionGroups);
  const acceptedPermissions = ['api:*:read', '*:*:read', '*', '*:*', '*:*:*'];
  const hasReadPermission = intersection(acceptedPermissions, permissions).length > 0;
  logger.info(logTag, 'Token accepted. Has required permissions:', hasReadPermission);
  return hasReadPermission;
}
