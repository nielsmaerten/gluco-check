import 'reflect-metadata';
import ConversationDecoder from '../../src/main/ConversationDecoder';
import {DiabetesPointer} from '../../src/types/DiabetesPointer';
import DiabetesQuery from '../../src/types/DiabetesQuery';

describe('Conversation Decoder', () => {
  const conversationDecoder = new ConversationDecoder();
  const testWebhookRequest = '../data/conversations/read-pointers-intent';
  const testConversation = require(testWebhookRequest).requestJson;

  let diabetesQuery: DiabetesQuery;

  beforeAll(() => {
    diabetesQuery = conversationDecoder.decode(testConversation);
  });

  it('extracts a parameter', () => {
    expect(diabetesQuery.pointers).toContain(DiabetesPointer.BloodSugar);
    expect(diabetesQuery.pointers).toContain(DiabetesPointer.InsulinOnBoard);
  });

  it('extracts the userId', () => {});

  it('extracts the user locale', () => {
    expect(diabetesQuery.locale).toEqual('en-US');
  });
});
