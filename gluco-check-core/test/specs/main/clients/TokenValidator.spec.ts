import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock Axios before importing the module under test
const mock = new MockAdapter(axios);
import {validateToken} from '../../../../src/main/clients/nightscout/TokenValidator';
import {sha1} from '../../../../src/main/utils';

// Constants for all urls
const TEST_URL = 'https://cgm.example.com';
const ENDPOINT_ROLES = TEST_URL + '/api/v2/authorization/roles';
const ENDPOINT_SUBJECTS = TEST_URL + '/api/v2/authorization/subjects';
const ENDPOINT_STATUS = TEST_URL + '/api/v1/status';

// Mock tokens and API secrets
const TOKEN_OK = 'token-OK';
const TOKEN_NOK = 'token-NOK';
const APISECRET_OK = 'secret-OK';
const HASH_OK = sha1(APISECRET_OK);

// Mock /status responses
const STATUS_NOK = {
  authorized: null,
  settings: {units: 'mg/dl'},
  version: '14.0.0',
};

const STATUS_OK = {
  ...STATUS_NOK,
  authorized: {
    permissionGroups: [['*:*:read']],
  },
};

// Mock /roles responses
const MOCK_ROLES_POST = [
  {
    name: 'gluco-check',
    permissions: ['*:*:read'],
    _id: '12345',
  },
];

const MOCK_ROLES_GET = [{...MOCK_ROLES_POST[0], accessToken: 'test'}];

// Mock /subjects responses
const MOCK_SUBJECTS_GET = [
  {
    name: 'gluco-check',
    roles: ['gluco-check'],
    accessToken: TOKEN_OK,
  },
];

const MOCK_SUBJECTS_POST = [{...MOCK_ROLES_GET[0]}];

describe('Nightscout Validator', () => {
  beforeAll(() => {
    mock.onGet(ENDPOINT_STATUS).reply(req => {
      if (req.params.token === TOKEN_OK) return [200, STATUS_OK];
      else if (req.headers['api-secret'] === HASH_OK) return [200, STATUS_OK];
      else return [200, STATUS_NOK];
    });
    mock.onAny(ENDPOINT_ROLES).reply(req => {
      if (req.headers['api-secret'] === HASH_OK) {
        if (req.method === 'post') return [200, MOCK_ROLES_POST];
        if (req.method === 'get') return [200, MOCK_ROLES_GET];
      }
      return [401, {status: 401}];
    });
    mock.onAny(ENDPOINT_SUBJECTS).reply(req => {
      if (req.headers['api-secret'] === HASH_OK) {
        if (req.method === 'get') return [200, MOCK_SUBJECTS_GET];
        if (req.method === 'post') return [200, MOCK_SUBJECTS_POST];
      }
      return [401, {status: 401}];
    });
  });

  it("rejects a value that's neither token nor api secret", async () => {
    const result = await validateToken(TOKEN_NOK, TEST_URL);
    expect(result.token?.isValid).toBeFalsy();
  });

  it('accepts a valid token', async () => {
    const result = await validateToken(TOKEN_OK, TEST_URL);
    expect(result.token?.isValid).toBeTruthy();
    expect(result.token?.parsed).toEqual(TOKEN_OK);
  });

  it.skip('creates a new role', async () => {
    const result = await validateToken(APISECRET_OK, TEST_URL);
    expect(result.token?.isValid).toBeTruthy();
    // TODO
    expect(result.token?.parsed).toEqual(TOKEN_OK);
  });

  it.skip('creates a new subject', async () => {
    // TODO
    fail();
  });
});
