import DiabetesSnapshot from '../../src/types/DiabetesSnapshot';

describe('DiabetesSnapshot', () => {
  it('always has a timestamp', () => {
    const snapshot = new DiabetesSnapshot(Date.now());
    expect(snapshot).toBeDefined();
    expect(snapshot.timestamp).toBeDefined();
  });
});
