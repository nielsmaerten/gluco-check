import UserSnapshot from '../../src/types/UserSnapshot';
const _1day = 24 * 60 * 60 * 1000;
const _360days = 360 * _1day;
const _366days = 366 * _1day;
const now = Date.now();

describe('UserSnapshot', () => {
  it('always has a timestamp', () => {
    const snapshot = new UserSnapshot({timestamp: Date.now()});
    expect(snapshot).toBeDefined();
  });

  it('rejects timestamps that are > 1 year old', () => {
    expect(() => new UserSnapshot({timestamp: now - _366days})).toThrow();
  });

  it('accepts timestamps that are < 1 year old', () => {
    expect(new UserSnapshot({timestamp: now - _360days})).toBeDefined();
  });

  it('rejects timestamps that are > 1 hour in the future', () => {
    expect(() => new UserSnapshot({timestamp: Date.now() + _1day})).toThrow();
  });
});
