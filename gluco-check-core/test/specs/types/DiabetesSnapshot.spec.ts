import DiabetesSnapshot from '../../../src/types/DiabetesSnapshot';
import fakeQuery from '../../fakes/objects/fakeDiabetesQuery';

describe('DiabetesSnapshot', () => {
  it('always has a timestamp', () => {
    const snapshot = new DiabetesSnapshot(Date.now(), fakeQuery);
    expect(snapshot).toBeDefined();
    expect(snapshot.timestamp).toBeDefined();
  });

  it('converts mmol/l', () => {
    const snapshot = new DiabetesSnapshot(Date.now(), fakeQuery);
    snapshot.glucoseValueMgDl = 120;
    expect(snapshot.glucoseValue()).toEqual(6.7);
  });
});
