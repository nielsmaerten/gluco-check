/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import GlucoCheckCore from '../../../src/main';

describe('GlucoCheck Core', () => {
  const mocks = {
    conversation: {add: jest.fn()},
    conversationDecoder: {decode: jest.fn()} as any,
    queryResolver: {buildSnapshot: jest.fn()} as any,
    responseBuilder: {build: jest.fn().mockReturnValue({SSML: 'foo'})} as any,
  };

  beforeAll(() => {
    const glucoCheckCore = new GlucoCheckCore(
      mocks.conversationDecoder,
      mocks.queryResolver,
      mocks.responseBuilder
    );
    glucoCheckCore.handler(mocks.conversation as any);
  });

  it('attempts to decode a Conversation object', () => {
    expect(mocks.conversationDecoder.decode).toHaveBeenCalled();
  });

  it('attempts to resolve a userQuery', () => {
    expect(mocks.queryResolver.buildSnapshot).toHaveBeenCalled();
  });

  it('adds a response to the conversation', () => {
    expect(mocks.conversation.add).toHaveBeenCalledWith('foo');
  });
});
