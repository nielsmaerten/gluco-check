/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import ConversationDecoder from '../../src/main/ConversationDecoder';
import {DiabetesPointer} from '../../src/types/DiabetesPointer';
import DiabetesQuery from '../../src/types/DiabetesQuery';
import {Container} from 'inversify';
import UserProfileClient from '../../src/main/UserProfileClient';
import AuthTokenDecoder from '../../src/main/AuthTokenDecoder';
import mock_AuthTokenDecoder from '../data/mocks/AuthTokenDecoder';
import mock_UserProfileClient from '../data/mocks/UserProfileClient';

describe('Conversation Decoder', () => {
  const testConversations = {
    custom: require('../data/conversations/custom_pointers').requestJson,
    default: require('../data/conversations/default_pointers').requestJson,
  };
  let mainInvocationResult: DiabetesQuery;
  let deepInvocationResult: DiabetesQuery;

  beforeAll(async () => {
    const conversationDecoder = getTestContainer().get(ConversationDecoder);
    deepInvocationResult = await conversationDecoder.decode(testConversations.custom);
    mainInvocationResult = await conversationDecoder.decode(testConversations.default);
  });

  it("returns the user's default pointers when called through main intent", () => {
    const pointers = mainInvocationResult.pointers;
    expect(pointers).toContain(DiabetesPointer.BloodSugar);
  });

  it('extracts pointers from the intent params', () => {
    const pointers = deepInvocationResult.pointers;
    expect(pointers).toContain(DiabetesPointer.BloodSugar);
    expect(pointers).toContain(DiabetesPointer.SensorAge);
    expect(pointers).toContain(DiabetesPointer.InsulinOnBoard);
  });

  it('extracts the user locale', () => {
    expect(mainInvocationResult.locale).toEqual('en-US');
    expect(deepInvocationResult.locale).toEqual('en-US');
  });
});

function getTestContainer() {
  const c = new Container();
  c.bind(ConversationDecoder).toSelf();
  c.bind(AuthTokenDecoder).toConstantValue(new mock_AuthTokenDecoder() as any);
  c.bind(UserProfileClient).toConstantValue(new mock_UserProfileClient() as any);
  return c;
}
