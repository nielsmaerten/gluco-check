import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock Axios before importing the module under test
const mock = new MockAdapter(axios);
jest.mock('../../../../src/main/clients/nightscout/validation/TokenCreator');
import TokenCreator from '../../../../src/main/clients/nightscout/validation/TokenCreator';
import TokenValidator from '../../../../src/main/clients/nightscout/validation/TokenValidator';

// Constants for all urls
const TEST_URL = 'https://cgm.example.com';
const ENDPOINT_STATUS = TEST_URL + '/api/v1/status';

// Mock tokens and API secrets
const TOKEN_OK = 'token-OK';
const TOKEN_NOK = 'token-NOK';
const APISECRET_OK = 'secret-OK';
const HASH_OK = 'hash-OK';

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

describe('Token Validator', () => {
  beforeAll(() => {
    mock.onGet(ENDPOINT_STATUS).reply(req => {
      if (req.params.token === TOKEN_OK) return [200, STATUS_OK];
      else if (req.headers['api-secret'] === HASH_OK) return [200, STATUS_OK];
      else return [200, STATUS_NOK];
    });
  });

  it("rejects a value that's neither token nor api secret", async () => {
    const validator = new TokenValidator(TOKEN_NOK, TEST_URL);
    const result = await validator.validate();
    expect(result.token?.isValid).toBeFalsy();
  });

  it('accepts a valid token', async () => {
    const validator = new TokenValidator(TOKEN_OK, TEST_URL);
    const result = await validator.validate();
    expect(result.token?.isValid).toBeTruthy();
    expect(result.token?.parsed).toEqual(TOKEN_OK);
  });

  it('attempts to create a new token/role', async () => {
    const tokenCreatorMock = new TokenCreator('', '') as jest.Mocked<TokenCreator>;
    const validator = new TokenValidator(APISECRET_OK, TEST_URL);

    tokenCreatorMock.create.mockReset();
    await validator.validate();
    const mockCalled = tokenCreatorMock.create.mock.calls.length === 1;

    expect(mockCalled).toBeTruthy;
  });
});
