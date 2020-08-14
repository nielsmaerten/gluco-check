import GlucoCheckCore from '../src';

describe('GlucoCheck Core', () => {
  let stub = jest.fn();
  beforeAll(() => {
    //Container.bind(ConversationDecoder, {decode: stub });
  })
  it('exports global conversation handler', () => {
    GlucoCheckCore.handleAssistantConversation;
    expect(GlucoCheckCore.handleAssistantConversation).toBeDefined();
  });

  it('tries to decode a conversation object', () => {
    GlucoCheckCore.handleAssistantConversation({add: jest.fn()} as any);
    expect(stub).toHaveBeenCalled();
  });

  it('tries to resolve a userQuery', () => {});

  it('adds a response to the conversation', () => {});
});
