/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import ConversationDecoder from '../../../../src/main/core/ConversationDecoder';
import {DmMetric} from '../../../../src/types/DmMetric';
import DmQuery from '../../../../src/types/DmQuery';
import {Container} from 'inversify';
import UserProfileClient from '../../../../src/main/clients/UserProfileClient';
import AuthTokenDecoder from '../../../../src/main/core/AuthTokenDecoder';
import stub_AuthTokenDecoder = require('../../../stubs/AuthTokenDecoder');
import stub_UserProfileClient from '../../../stubs/UserProfileClient';

describe('Conversation Decoder', () => {
  const testConversations = {
    custom: require('../../../fakes/http-requests/custom_metrics').requestJson,
    default: require('../../../fakes/http-requests/default_metrics').requestJson,
  };
  let mainInvocationResult: DmQuery;
  let deepInvocationResult: DmQuery;

  beforeAll(async () => {
    const conversationDecoder = getTestContainer().get(ConversationDecoder);
    deepInvocationResult = await conversationDecoder.decode(testConversations.custom);
    mainInvocationResult = await conversationDecoder.decode(testConversations.default);
  });

  it("returns the user's default metrics when called through main intent", () => {
    const metrics = mainInvocationResult.metrics;
    expect(metrics).toContain(DmMetric.BloodSugar);
  });

  it('extracts metrics from the intent params', () => {
    const metrics = deepInvocationResult.metrics;
    expect(metrics).toContain(DmMetric.BloodSugar);
    expect(metrics).toContain(DmMetric.SensorAge);
    expect(metrics).toContain(DmMetric.InsulinOnBoard);
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

    // In case of deep invocation, the metrics should be the ones asked for
    expect(deepInvocationResult.metrics).toContain(DmMetric.BloodSugar);
    expect(deepInvocationResult.metrics).toContain(DmMetric.SensorAge);
    expect(deepInvocationResult.metrics).toContain(DmMetric.InsulinOnBoard);

    // In case of main invocation, metrics should be empty
    expect(mainInvocationResult.metrics).toHaveLength(0);
  });
});

function getTestContainer(userExists = true) {
  const c = new Container();
  const _stub_UserProfileClient = new stub_UserProfileClient(userExists);
  c.bind(ConversationDecoder).toSelf();
  c.bind(AuthTokenDecoder).toConstantValue(stub_AuthTokenDecoder as any);
  c.bind(UserProfileClient).toConstantValue(_stub_UserProfileClient as any);
  return c;
}
