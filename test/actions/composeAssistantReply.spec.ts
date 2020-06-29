import {composeAssistantReply} from '../../src';

describe('composeAssistantReply', () => {
  it('accepts a UserSnapshot', () => {
    composeAssistantReply(userStatusSnapshot);
  });

  it('produces a reply for the Assistant', () => {
    const reply = composeAssistantReply(userStatusSnapshot);
    expect(typeof reply).toBe('string');
  });
});
