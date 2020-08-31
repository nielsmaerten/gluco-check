import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock data
import mock_sensorAge from '../http-examples/responses/sensor-change';
import mock_cannulaAge from '../http-examples/responses/cannula-change';
import mock_currentEntry from '../http-examples/responses/current-entry';
import mock_deviceStatus from '../http-examples/responses/devicestatus';

const mock = new MockAdapter(axios);
const baseUrl = 'https://cgm.example.com/api';

const respondWithMockData = () => {
  mock.reset();

  mock.onGet(`${baseUrl}/v1/entries/current.json`).reply(() => [200, mock_currentEntry]);
  mock.onGet(`${baseUrl}/v1/devicestatus.json`).reply(() => [200, mock_deviceStatus]);

  mock.onGet(`${baseUrl}/v3/treatments.json`).reply(config => {
    // Depending on requested treatment, respond w/ different mock data
    const eventType = config.params.eventType;
    switch (eventType) {
      case 'Sensor Change':
        return [200, mock_sensorAge];
      case 'Site Change':
        return [200, mock_cannulaAge];
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

export default {
  respondWith401Unauthorized,
  respondWithTimeout,
  respondWithMockData,
  axios,
};
