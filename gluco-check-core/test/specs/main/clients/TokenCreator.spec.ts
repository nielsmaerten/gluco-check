import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock Axios before importing the module under test
const mock = new MockAdapter(axios);
jest.dontMock('../../../../src/main/clients/nightscout/validation/TokenCreator');
import TokenCreator from '../../../../src/main/clients/nightscout/validation/TokenCreator';
import {sha1} from '../../../../src/main/utils';

// Constants for all urls
const TEST_URL = 'https://cgm.example.com';
const ENDPOINT_ROLES = TEST_URL + '/api/v2/authorization/roles';
const ENDPOINT_SUBJECTS = TEST_URL + '/api/v2/authorization/subjects';
const ENDPOINT_STATUS = TEST_URL + '/api/v1/status';

// Mock tokens and API secrets
const TOKEN_OK = 'token-OK';
const APISECRET_OK = 'secret-OK';
const HASH_OK = sha1(APISECRET_OK);
const SUBJECT__AND_ROLE_NAME = 'gluco-check';

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
    name: 'set in beforeEach()',
    permissions: ['*:*:read'],
    _id: '12345',
  },
];

const MOCK_ROLES_GET = [{...MOCK_ROLES_POST[0], accessToken: 'test'}];

// Mock /subjects responses
const MOCK_SUBJECTS_GET = [
  {
    name: 'set in beforeEach()',
    roles: ['gluco-check'],
    accessToken: TOKEN_OK,
  },
];

const MOCK_SUBJECTS_POST = [{...MOCK_ROLES_GET[0]}];

describe('Token Creator', () => {
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

  beforeEach(() => {
    MOCK_ROLES_GET[0].name = SUBJECT__AND_ROLE_NAME;
    MOCK_SUBJECTS_GET[0].name = SUBJECT__AND_ROLE_NAME;
    mock.resetHistory();
  });

  it('skips creating role/subject if they already exist', async () => {
    const validator = new TokenCreator(APISECRET_OK, TEST_URL);
    await validator.create();

    // TokenCreator should not have made other requests
    expect(mock.history.post.length).toBe(0);
  });

  it('creates role & subject', async () => {
    MOCK_ROLES_GET[0].name = 'non-existent';
    MOCK_SUBJECTS_GET[0].name = 'non-existent';
    const validator = new TokenCreator(APISECRET_OK, TEST_URL);
    await validator.create();

    // TokenCreator should have made 2 post requests
    // 1 to /roles, then 1 to /subjects
    const rolesPostReq = mock.history.post[0];
    const rolesPostData = JSON.parse(rolesPostReq.data);
    const subjectPostReq = mock.history.post[1];
    const subjectPostData = JSON.parse(subjectPostReq.data);

    // Inspect the /roles post request
    expect(rolesPostReq.url).toBe(ENDPOINT_ROLES);
    expect(rolesPostData).toMatchObject({
      name: SUBJECT__AND_ROLE_NAME,
      permissions: MOCK_ROLES_POST[0].permissions,
    });

    // Inspect the /subjects post request
    expect(subjectPostReq.url).toBe(ENDPOINT_SUBJECTS);
    expect(subjectPostData).toMatchObject({
      name: SUBJECT__AND_ROLE_NAME,
      roles: MOCK_SUBJECTS_GET[0].roles,
    });
  });
});
