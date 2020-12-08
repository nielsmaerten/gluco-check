import NightscoutClient from '../../../../src/main/clients/nightscout/NightscoutClient';
import NightscoutProps from '../../../../src/types/NightscoutProps';
import AxiosMock from '../../../stubs/AxiosMockAdapter';

describe('Nightscout Validator', () => {
  afterEach(() => AxiosMock.resetMock());

  it('accepts a valid url', async () => {
    AxiosMock.respondWithMockData();
    const testUrl = 'https://cgm.example.com';
    const {urlIsValid, parsedUrl} = await runTestValidation(testUrl);

    expect(parsedUrl).toBe(testUrl);
    expect(urlIsValid).toBeTruthy();
  });

  it('rejects an invalid url', async () => {
    const testUrl = 'this-is-no-url';
    const {urlIsValid} = await runTestValidation(testUrl);

    expect(urlIsValid).toBeFalsy();
  });

  it('extracts baseUrl', async () => {
    AxiosMock.respondWithMockData();
    const testUrl = 'https://cgm.example.com/api/v3?token=abc1234';
    const expectedBaseUrl = 'https://cgm.example.com';
    const {parsedUrl, urlIsValid} = await runTestValidation(testUrl);

    expect(parsedUrl).toBe(expectedBaseUrl);
    expect(urlIsValid).toBeTruthy();
  });

  it('accepts a valid token', async () => {
    AxiosMock.respondWithMockData();
    const testUrl = 'https://cgm.example.com';
    const testToken = 'test-token';
    const results = await runTestValidation(testUrl, testToken);

    expect(results.tokenIsValid).toBeTruthy();
  });

  it('rejects an invalid token', async () => {
    AxiosMock.respondWith401Unauthorized();
    const testUrl = 'https://cgm.example.com';
    const testToken = 'test-token';
    const results = await runTestValidation(testUrl, testToken);
    expect(results.tokenIsValid).toBeFalsy();
  });

  it('reads settings and metrics', async () => {
    AxiosMock.respondWithMockData();
    const testUrl = 'https://cgm.example.com';
    const testToken = 'test-token';
    const results = await runTestValidation(testUrl, testToken);

    expect(results.canReadStatus).toBeTruthy();
    expect(results.glucoseUnit).toBe('mg/dl');
    expect(results.version).toBe('14.0.7');
    expect(results.readableMetrics.length).toBeGreaterThan(0);
  });

  it('trims url and token', async () => {
    const testUrl = '    https://cgm.example.com   ';
    const testToken = '   test-token  ';
    const results = await runTestValidation(testUrl, testToken);

    expect(results.parsedToken).toBe('test-token');
    expect(results.parsedUrl).toBe('https://cgm.example.com');
  });
});

const runTestValidation = (url: string, token?: string) => {
  const props = new NightscoutProps(url, token);
  const clientUnderTest = new NightscoutClient(props);
  return clientUnderTest.validate();
};
