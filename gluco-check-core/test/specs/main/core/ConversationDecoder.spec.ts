/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import ConversationDecoder from '../../../../src/main/core/ConversationDecoder';
import {DiabetesPointer} from '../../../../src/types/DiabetesPointer';
import DiabetesQuery from '../../../../src/types/DiabetesQuery';
import {Container} from 'inversify';
import UserProfileClient from '../../../../src/main/clients/UserProfileClient';
import AuthTokenDecoder from '../../../../src/main/core/AuthTokenDecoder';
import mock_AuthTokenDecoder = require('../../../mocks/AuthTokenDecoder');
import mock_UserProfileClient from '../../../mocks/UserProfileClient';

describe('Conversation Decoder', () => {
  const testConversations = {
    custom: require('../../../http-examples/requests/custom_pointers').requestJson,
    default: require('../../../http-examples/requests/default_pointers').requestJson,
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

  it('returns a Query for non-existing users', async () => {
    // Get a special conversationDecoder that will have a non-existing user
    const decoder = getTestContainer(false).get(ConversationDecoder);
    const deepInvocationResult = await decoder.decode(testConversations.custom);
    const mainInvocationResult = await decoder.decode(testConversations.default);

    // In case of deep invocation, the pointers should be the ones asked for
    expect(deepInvocationResult.pointers).toContain(DiabetesPointer.BloodSugar);
    expect(deepInvocationResult.pointers).toContain(DiabetesPointer.SensorAge);
    expect(deepInvocationResult.pointers).toContain(DiabetesPointer.InsulinOnBoard);

    // In case of main invocation, the pointer should just be BloodSugar
    expect(mainInvocationResult.pointers).toContain(DiabetesPointer.BloodSugar);
  });
});

function getTestContainer(userExists = true) {
  const c = new Container();
  c.bind(ConversationDecoder).toSelf();
  c.bind(AuthTokenDecoder).toConstantValue(mock_AuthTokenDecoder as any);
  c.bind(UserProfileClient).toConstantValue(
    new mock_UserProfileClient(userExists) as any
  );
  return c;
}
