import User from '../../src/types/User';
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

  const exampleSnapshot: DiabetesSnapshot = {
    timestamp: new Date('2020-01-21T10:10:00Z').getTime(),
    cannulaInserted: new Date('2020-01-20T10:10:00Z').getTime(),
    sensorInserted: new Date('2020-01-21T08:10:00Z').getTime(),
    carbsOnBoard: 15,
    glucoseTrend: GlucoseTrend.Rising,
    glucoseUnit: GlucoseUnit.mgDl,
    glucoseValue: 120,
    insulinOnBoard: 12.3,
  };

  it('fetches a DiabetesSnapshot', async () => {
    const snapshot = NightscoutClient.getSnapshot(testUser);
    expect(snapshot).toEqual(exampleSnapshot);
  });
});
