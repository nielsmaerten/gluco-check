import DiabetesSnapshot from '../../src/types/DiabetesSnapshot';

describe('DiabetesSnapshot', () => {
  it('always has a timestamp', () => {
    const snapshot = new DiabetesSnapshot({timestamp: Date.now()});
    expect(snapshot).toBeDefined();
  });

  it('rejects incorrect timestamps', () => {
    expect(() => new DiabetesSnapshot({timestamp: 0})).toThrow();
    expect(() => new DiabetesSnapshot({timestamp: -1})).toThrow();
  });
});
