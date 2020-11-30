import User from '../../../../src/types/User';
import AxiosMock from '../../../stubs/AxiosMockAdapter';
import {DmMetric} from '../../../../src/types/DmMetric';
import NightscoutProps from '../../../../src/types/NightscoutProps';
import NightscoutClient from '../../../../src/main/clients/nightscout/NightscoutClient';
import DmSnapshot from '../../../../src/types/DmSnapshot';
import {GlucoseTrend} from '../../../../src/types/GlucoseTrend';
import {GlucoseUnit} from '../../../../src/types/GlucoseUnit';
import DmQuery from '../../../../src/types/DmQuery';
import {ErrorType} from '../../../../src/types/ErrorType';

describe('NightscoutClient', () => {
  const testUser: User = {
    exists: true,
    userId: 'test@example.com',
    defaultPointers: [DmMetric.Everything],
    nightscout: new NightscoutProps('https://cgm.example.com'),
  };
  const testQuery = new DmQuery(testUser, 'en-US', testUser.defaultPointers!);

  const expected = new DmSnapshot({
    timestamp: new Date('2020-01-21T10:10:00Z').getTime(),
    query: testQuery,
  });
  Object.assign(expected, {
    cannulaInserted: new Date('2020-08-18T09:47:48Z').getTime(),
    sensorInserted: new Date('2020-08-23T15:05:21Z').getTime(),
    glucoseTrend: GlucoseTrend.Rising,
    glucoseUnit: GlucoseUnit.mgDl,
    glucoseValueMgDl: 120,
    insulinOnBoard: 12.3,
    carbsOnBoard: 15,
  });

  let testClient: NightscoutClient;

  beforeAll(() => AxiosMock.respondWithMockData());

  beforeEach(() => {
    testClient = new NightscoutClient(testUser.nightscout!);
  });

  it('fetches Glucose', async () => {
    const data = await testClient.getMetric(DmMetric.BloodSugar);
    expect(data).toMatchObject({
      glucoseTrend: expected.glucoseTrend,
      glucoseValueMgDl: expected.glucoseValue(),
    });
  });

  it('does not repeat api calls', async () => {
    const spy = jest.spyOn(AxiosMock.axios, 'request');

    // These 2 metrics can be retrieved from 1 call.
    // They should both return information, but the call should only be executed once
    await testClient.getMetric(DmMetric.CarbsOnBoard);
    await testClient.getMetric(DmMetric.InsulinOnBoard);

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();
  });

  it('fetches Cannula info', async () => {
    const data = await testClient.getMetric(DmMetric.CannulaAge);
    expect(data.cannulaInserted).toEqual(expected.cannulaInserted);
  });

  it('fetches Sensor info', async () => {
    const data = await testClient.getMetric(DmMetric.SensorAge);
    expect(data.sensorInserted).toEqual(expected.sensorInserted);
  });

  it('sets the error prop when Nightscout is unavailable', done => {
    AxiosMock.respondWithTimeout();
    testClient.getMetric(DmMetric.BloodSugar).then(e => {
      expect(e.errors).toHaveLength(1);
      expect(e.errors![0].type).toEqual(ErrorType.Nightscout_Unavailable);
      expect(e.errors![0].affectedMetric).toEqual(DmMetric.BloodSugar);
      done();
    });
  });

  it('sets the error prop when Nightscout is unauthorized', done => {
    AxiosMock.respondWith401Unauthorized();
    testClient.getMetric(DmMetric.BloodSugar).then(e => {
      expect(e.errors).toHaveLength(1);
      expect(e.errors![0].type).toEqual(ErrorType.Nightscout_Unauthorized);
      expect(e.errors![0].affectedMetric).toEqual(DmMetric.BloodSugar);
      done();
    });
  });
});
