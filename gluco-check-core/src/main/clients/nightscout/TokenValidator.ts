import axios, {AxiosRequestConfig} from 'axios';
import {logger} from 'firebase-functions';
import {URL} from 'url';
import {GlucoseUnit} from '../../../types/GlucoseUnit';
import NightscoutValidationResult from '../../../types/NightscoutValidationResult';
import {nightscoutMinVersion} from '../../constants';
import {flattenDeep, intersection} from '../../utils';
import {createNewToken} from './TokenCreator';
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

export async function validateToken(token: string | undefined, url: string) {
  try {
    logger.info(logTag, `Trying to access ${url} using provided token`);
    return runTokenValidation(token, url);
  } catch {
    logger.info(logTag, 'Validation failed: unknown error');
    return {isValid: false, parsed: token} as Partial<NightscoutValidationResult>;
  }
}

async function runTokenValidation(token = '', url: string) {
  // Trim whitespace from token
  let statusResponse: StatusResponse;
  let candidate = token.trim();

  // If token was entered as a URL, strip the url part
  candidate = stripUrl(candidate, url);

  // Check token's authorization status
  statusResponse = await tryFetchStatus(candidate, url);

  // If validation fails, this 'token' may still be an api secret
  if (statusResponse.authorized === null) {
    const newToken = await createNewToken(candidate, url);
    if (newToken) {
      statusResponse = await tryFetchStatus(newToken, url);
    }
  }

  // Parse response and return result
  return parseResponse(statusResponse, candidate);
}

/**
 * Tokens may be copied from Nightscout as a URL
 * This functions checks this and extracts the token if that's the case.
 * Otherwise, the normal token is returned
 */
function stripUrl(token: string, url: string) {
  if (token.startsWith(url)) {
    logger.info(logTag, 'Provided value is a url. Extracting token');
    return new URL(token).searchParams.get('token') || token;
  } else return token;
}

/**
 * Attempts to fetch /api/v1/status with authorization
 */
async function tryFetchStatus(candidate: string, url: string) {
  // Build request
  const api = `${url}/api/v1/status`;
  const req: AxiosRequestConfig = {
    url: api,
    params: {
      token: candidate,
    },
  };

  // Extract response
  const response = await axios.request<StatusResponse>(req);
  return response.data;
}

function parseResponse(statusResponse: StatusResponse, token: string) {
  return {
    token: {
      isValid: hasReadPermission(statusResponse),
      parsed: token,
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
