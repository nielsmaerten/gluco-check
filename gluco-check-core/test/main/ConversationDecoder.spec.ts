/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import ConversationDecoder from '../../src/main/ConversationDecoder';
import {DiabetesPointer} from '../../src/types/DiabetesPointer';
import DiabetesQuery from '../../src/types/DiabetesQuery';
import AuthTokenDecoder from '../data/mocks/AuthTokenDecoder';

describe('Conversation Decoder', () => {
  const mockAuthTokenDecoder = new AuthTokenDecoder() as any;
  const conversationDecoder = new ConversationDecoder(mockAuthTokenDecoder);
  const testWebhookRequest = '../data/conversations/read-pointers-intent';
  const testConversation = require(testWebhookRequest).requestJson;

  let diabetesQuery: DiabetesQuery;

  beforeAll(async () => {
    diabetesQuery = await conversationDecoder.decode(testConversation);
  });

  it('extracts a parameter', () => {
    expect(diabetesQuery.pointers).toContain(DiabetesPointer.BloodSugar);
    expect(diabetesQuery.pointers).toContain(DiabetesPointer.InsulinOnBoard);
  });

  it('extracts the userId', () => {
    expect(diabetesQuery.userId).toBe('test@example.com');
  });

  it('extracts the user locale', () => {
    expect(diabetesQuery.locale).toEqual('en-US');
  });
});
