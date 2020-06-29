import {composeAssistantReply, decodeAssistantQuery} from '../src';

describe('GlucoCheck Core', () => {
  it('exports function: composeAssistantReply', () => {
    expect(typeof composeAssistantReply).toBe('function');
  });

  it('exports function: decodeAssistantReply', () => {
    expect(typeof decodeAssistantQuery).toBe('function');
  });
});
