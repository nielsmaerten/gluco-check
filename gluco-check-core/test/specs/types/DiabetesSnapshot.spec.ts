import DiabetesSnapshot from '../../../src/types/DiabetesSnapshot';
import getFakeQuery from '../../fakes/objects/fakeDiabetesQuery';

describe('DiabetesSnapshot', () => {
  it('always has a timestamp', () => {
    const snapshot = new DiabetesSnapshot(Date.now(), getFakeQuery());
    expect(snapshot).toBeDefined();
    expect(snapshot.timestamp).toBeDefined();
  });

  it('converts mmol/l', () => {
    const snapshot = new DiabetesSnapshot(Date.now(), getFakeQuery());
    snapshot.glucoseValueMgDl = 120;
    expect(snapshot.glucoseValue()).toEqual(6.7);
  });
});
