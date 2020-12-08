import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock data
import stub_sensorAge from '../fakes/http-responses/sensor-change';
import stub_cannulaAge from '../fakes/http-responses/cannula-change';
import stub_currentEntry from '../fakes/http-responses/current-entry';
import stub_deviceStatus from '../fakes/http-responses/devicestatus';
import stub_nightscoutStatus from '../fakes/http-responses/nightscout-status';

const mock = new MockAdapter(axios);
const baseUrl = 'https://cgm.example.com/api';

const respondWithMockData = () => {
  mock.reset();

  mock.onGet(`${baseUrl}/v1/entries/current`).reply(() => [200, stub_currentEntry]);
  mock
    .onGet(new RegExp(`${baseUrl}/v1/status*`))
    .reply(() => [200, stub_nightscoutStatus]);
  mock.onGet(`${baseUrl}/v3/devicestatus`).reply(() => [200, stub_deviceStatus]);

  mock.onGet(`${baseUrl}/v3/treatments`).reply(config => {
    // Depending on requested treatment, respond w/ different mock data
    const eventType = config.params.eventType;
    switch (eventType) {
      case 'Sensor Change':
        return [200, stub_sensorAge];
      case 'Site Change':
        return [200, stub_cannulaAge];
      default:
        throw 'No mock data available to for this request';
    }
  });

  return mock;
};

const respondWith401Unauthorized = () => {
  mock.reset();
  mock.onAny().reply(401, 'Unauthorized.');
};

const respondWithTimeout = () => {
  mock.reset();
  mock.onAny().timeout();
};

const resetMock = () => {
  mock.reset();
};

export default {
  respondWith401Unauthorized,
  respondWithTimeout,
  respondWithMockData,
  resetMock,
  axios,
};
