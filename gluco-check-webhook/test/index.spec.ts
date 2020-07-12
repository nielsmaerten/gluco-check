import * as Webhooks from '../src';

describe('Gluco Check Webhooks', () => {
  it('exports an assistant function', () => {
    expect(Webhooks.validateNightscoutUrl).toBeDefined();
  });
});
