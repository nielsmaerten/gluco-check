import * as Webhooks from '../src';

describe('Gluco Check Webhooks', () => {
  it('has a function to validate Nightscout URLs', () => {
    expect(Webhooks.validateNightscoutUrl).toBeDefined();
  });

  it('has a function to handle DialogFlow requests', () => {
    expect(Webhooks.dialogflow).toBeDefined();
  });
});
