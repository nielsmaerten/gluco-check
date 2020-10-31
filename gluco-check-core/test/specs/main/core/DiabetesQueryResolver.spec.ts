/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

const stub_ResponseFormatter = {
  buildErrorResponse: jest.fn(),
  buildResponse: jest.fn(),
} as any;

import DiabetesQueryResolver from '../../../../src/main/core/DiabetesQueryResolver';
import ResponseFormatter from '../../../../src/main/core/ResponseFormatter';
import {Container} from 'inversify';
import AxiosMockAdapter from '../../../stubs/AxiosMockAdapter';
import getFakeQuery from '../../../fakes/objects/fakeDiabetesQuery';

describe('Diabetes Query Resolver', () => {
  const container = getTestContainer();
  const diabetesQueryResolver = container.get(DiabetesQueryResolver);
  AxiosMockAdapter.respondWithMockData();

  beforeEach(() => {
    stub_ResponseFormatter.buildErrorResponse.mockReset();
    stub_ResponseFormatter.buildResponse.mockReset();
  });

  it('calls formatError when user is not found', async () => {
    const fakeQuery = getFakeQuery();
    fakeQuery.user.exists = false;
    await diabetesQueryResolver.resolve(fakeQuery);

    expect(stub_ResponseFormatter.buildErrorResponse).toHaveBeenCalled();
    expect(stub_ResponseFormatter.buildResponse).not.toHaveBeenCalled();
  });

  it('calls formatError when user exists but has no Nightscout site', async () => {
    const fakeQuery = getFakeQuery();
    fakeQuery.user.nightscout = undefined;
    await diabetesQueryResolver.resolve(fakeQuery);

    expect(stub_ResponseFormatter.buildErrorResponse).toHaveBeenCalled();
    expect(stub_ResponseFormatter.buildResponse).not.toHaveBeenCalled();
  });

  it('calls formatResponse when query has a user and nightscout site', async () => {
    const fakeQuery = getFakeQuery();
    await diabetesQueryResolver.resolve(fakeQuery);

    expect(stub_ResponseFormatter.buildErrorResponse).not.toHaveBeenCalled();
    expect(stub_ResponseFormatter.buildResponse).toHaveBeenCalled();
  });
});

function getTestContainer() {
  const c = new Container();
  c.bind(ResponseFormatter).toConstantValue(stub_ResponseFormatter);
  c.bind(DiabetesQueryResolver).toSelf();
  return c;
}
