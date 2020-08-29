import User from '../../src/types/User';
import AxiosMock from '../data/mocks/AxiosMockAdapter';
import {DiabetesPointer} from '../../src/types/DiabetesPointer';
import NightscoutProps from '../../src/types/NightscoutProps';
import NightscoutClient from '../../src/main/clients/NightscoutClient';
import DiabetesSnapshot from '../../src/types/DiabetesSnapshot';
import {GlucoseTrend} from '../../src/types/GlucoseTrend';
import {GlucoseUnit} from '../../src/types/GlucoseUnit';

describe('NightscoutClient', () => {
  const testUser: User = {
    exists: true,
    userId: 'test@example.com',
    defaultPointers: [DiabetesPointer.Everything],
    nightscout: new NightscoutProps('https://cgm.example.com'),
  };

  const expected = new DiabetesSnapshot(new Date('2020-01-21T10:10:00Z').getTime());
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
    const data = await testClient.getPointer(DiabetesPointer.BloodSugar);
    expect(data).toEqual({
      glucoseTrend: expected.glucoseTrend,
      glucoseValueMgDl: expected.glucoseValue(),
    });
  });

  it('does not repeat api calls', async () => {
    const spy = jest.spyOn(AxiosMock.axios, 'request');

    // These 2 pointers can be retrieved from 1 call.
    // They should both return information, but the call should only be executed once
    await testClient.getPointer(DiabetesPointer.CarbsOnBoard);
    await testClient.getPointer(DiabetesPointer.InsulinOnBoard);

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();
  });

  it('fetches Cannula info', async () => {
    const data = await testClient.getPointer(DiabetesPointer.CannulaAge);
    expect(data.cannulaInserted).toEqual(expected.cannulaInserted);
  });

  it('fetches Sensor info', async () => {
    const data = await testClient.getPointer(DiabetesPointer.SensorAge);
    expect(data.sensorInserted).toEqual(expected.sensorInserted);
  });
});
