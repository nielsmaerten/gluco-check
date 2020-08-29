import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock data
import mock_sensorAge from '../mocks/api-mocks/sensor-change';
import mock_cannulaAge from '../mocks/api-mocks/cannula-change';
import mock_currentEntry from '../mocks/api-mocks/current-entry';
import mock_deviceStatus from '../mocks/api-mocks/devicestatus';

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

export default {respondWith401Unauthorized, respondWithMockData, axios};
