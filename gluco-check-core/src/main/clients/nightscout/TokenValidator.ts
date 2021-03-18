import axios, {AxiosRequestConfig} from 'axios';
import {createHash} from 'crypto';
import {logger} from 'firebase-functions';
import {URL} from 'url';
import {GlucoseUnit} from '../../../types/GlucoseUnit';
import NightscoutValidationResult from '../../../types/NightscoutValidationResult';
import {nightscoutMinVersion} from '../../constants';
import {flattenDeep, intersection} from '../../utils';
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

enum TokenType {
  token = 'token',
  secret = 'apiSecret',
}

export async function validateToken(token = '', url: string) {
  // These values will be updated as we run validations
  let candidate = '';
  let statusResponse: StatusResponse;

  // Trim whitespace
  candidate = token.trim();

  // Extract url-type token
  candidate = tryParseUrl(candidate, url);

  // Validate as a normal token
  statusResponse = await tryFetchStatus(candidate, url, TokenType.token);

  // If validation fails, validate as an API secret
  if (statusResponse.authorized === null)
    statusResponse = await tryFetchStatus(candidate, url, TokenType.secret);

  // Parse response and return result
  return parseResponse(statusResponse, candidate);
}

/**
 * Tokens may be copied from Nightscout as a URL
 * This functions checks this and extracts the token if that's the case.
 * Otherwise, the normal token is returned
 */
function tryParseUrl(token: string, url: string) {
  if (token.startsWith(url)) {
    logger.info(logTag, 'Token formatted as url. Extracting token value');
    return new URL(token).searchParams.get('token') || token;
  } else return token;
}

/**
 * Attempts to fetch /api/v1/status with authorization
 */
async function tryFetchStatus(candidate: string, url: string, tokenType: TokenType) {
  // Build basic request
  const api = `${url}/api/v1/status`;
  const req: AxiosRequestConfig = {url: api};

  // Configure Auth depending on whether to use apiSecret or Token
  if (tokenType === TokenType.token) req.params = {token: candidate};
  if (tokenType === TokenType.secret) req.headers = {'api-key': sha1(candidate)};

  // Extract response
  const response = await axios.request(req);
  return response.data as StatusResponse;
}

function sha1(input: string) {
  const hash = createHash('sha1');
  hash.update(input);
  return hash.digest('hex');
}

function parseResponse(statusResponse: StatusResponse, candidate: string) {
  return {
    token: {
      isValid: hasReadPermission(statusResponse),
      parsed: candidate,
    },
    nightscout: {
      version: statusResponse.version,
      glucoseUnit: statusResponse.settings?.units,
      minSupportedVersion: nightscoutMinVersion,
    },
  } as Partial<NightscoutValidationResult>;
}

function hasReadPermission(status: StatusResponse): boolean {
  const {authorized} = status;
  if (authorized === null) return false;

  const permissionGroups = authorized.permissionGroups || [];
  const permissions: string[] = flattenDeep(permissionGroups);
  const acceptedPermissions = ['api:*:read', '*:*:read', '*', '*:*', '*:*:*'];
  const hasReadPermission = intersection(acceptedPermissions, permissions).length > 0;
  return hasReadPermission;
}
