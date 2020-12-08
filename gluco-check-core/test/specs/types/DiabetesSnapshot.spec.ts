import DmSnapshot from '../../../src/types/DmSnapshot';
import getFakeQuery from '../../fakes/objects/fakeDmQuery';

describe('DiabetesSnapshot', () => {
  it('always has a timestamp', () => {
    const snapshot = new DmSnapshot({
      query: getFakeQuery(),
      timestamp: Date.now(),
    });
    expect(snapshot).toBeDefined();
    expect(snapshot.timestamp).toBeDefined();
  });

  it('converts mmol/l', () => {
    const snapshot = new DmSnapshot({
      query: getFakeQuery(),
      timestamp: Date.now(),
    });
    snapshot.glucoseValueMgDl = 120;
    expect(snapshot.glucoseValue()).toEqual(6.7);
  });
});
