import NightscoutClient from '../../../../src/main/clients/nightscout/NightscoutClient';
import NightscoutProps from '../../../../src/types/NightscoutProps';
import AxiosMock from '../../../stubs/AxiosMockAdapter';

describe('Nightscout Validator', () => {
  afterEach(() => AxiosMock.resetMock());

  it('accepts a valid url', async () => {
    AxiosMock.respondWithMockData();
    const testUrl = 'https://cgm.example.com';
    const result = await runTestValidation(testUrl);

    expect(result.url.parsed).toBe(testUrl);
    expect(result.url.isValid).toBeTruthy();
  });

  it('rejects an invalid url', async () => {
    const testUrl = 'this-is-no-url';
    const result = await runTestValidation(testUrl);

    expect(result.url.isValid).toBeFalsy();
  });

  it('extracts baseUrl', async () => {
    AxiosMock.respondWithMockData();
    const testUrl = 'https://cgm.example.com/api/v3?token=abc1234';
    const expectedBaseUrl = 'https://cgm.example.com';
    const result = await runTestValidation(testUrl);

    expect(result.url.parsed).toBe(expectedBaseUrl);
    expect(result.url.isValid).toBeTruthy();
  });

  it('accepts a valid token', async () => {
    AxiosMock.respondWithMockData();
    const testUrl = 'https://cgm.example.com';
    const testToken = 'test-token';
    const results = await runTestValidation(testUrl, testToken);

    expect(results.token.isValid).toBeTruthy();
  });

  it('extracts token from url', async () => {
    AxiosMock.respondWithMockData();
    const testUrl = 'https://cgm.example.com';
    const testToken = 'test-token';
    const urlFormattedToken = `${testUrl}?token=${testToken}`;
    const results = await runTestValidation(testUrl, urlFormattedToken);

    expect(results.token.parsed).toBe(testToken);
  });

  it('adds http if it is missing from url', async () => {
    AxiosMock.respondWithMockData();
    const testUrl = 'cgm.example.com';
    const testToken = 'test-token';
    const results = await runTestValidation(testUrl, testToken);

    expect(results.url.isValid).toBeTruthy();
    expect(results.url.parsed).toBe(`http://${testUrl}`);
  });

  it('rejects an invalid token', async () => {
    AxiosMock.respondWith401Unauthorized();
    const testUrl = 'https://cgm.example.com';
    const testToken = 'test-token';
    const results = await runTestValidation(testUrl, testToken);
    expect(results.token.isValid).toBeFalsy();
  });

  it('reads settings and metrics', async () => {
    AxiosMock.respondWithMockData();
    const testUrl = 'https://cgm.example.com';
    const testToken = 'test-token';
    const results = await runTestValidation(testUrl, testToken);

    expect(results.nightscout.version).toBeTruthy();
    expect(results.nightscout.glucoseUnit).toBe('mg/dl');
    expect(results.nightscout.version).toBe('14.0.7');
    expect(results.discoveredMetrics.length).toBeGreaterThan(0);
  });

  it('trims url and token', async () => {
    AxiosMock.respondWithMockData();
    const testUrl = '    https://cgm.example.com   ';
    const testToken = '   test-token  ';
    const results = await runTestValidation(testUrl, testToken);

    expect(results.token.parsed).toBe('test-token');
    expect(results.url.parsed).toBe('https://cgm.example.com');
  });

  it('rejects a non-nightscout site', async () => {
    const testUrl = 'https://example.com';
    const testToken = 'abc-123';
    const results = await runTestValidation(testUrl, testToken);
    expect(results.url.pointsToNightscout).toBeFalsy();
  });
});

const runTestValidation = (url: string, token?: string) => {
  const props = new NightscoutProps(url, token);
  const clientUnderTest = new NightscoutClient(props);
  return clientUnderTest.validate();
};
