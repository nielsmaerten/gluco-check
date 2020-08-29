import DiabetesSnapshot from '../../src/types/DiabetesSnapshot';

describe('DiabetesSnapshot', () => {
  it('always has a timestamp', () => {
    const snapshot = new DiabetesSnapshot(Date.now());
    expect(snapshot).toBeDefined();
    expect(snapshot.timestamp).toBeDefined();
  });

  it('converts mmol/l', () => {
    const snapshot = new DiabetesSnapshot(Date.now());
    snapshot.glucoseValueMgDl = 120;
    expect(snapshot.glucoseValue()).toEqual(6.7);
  });
});
