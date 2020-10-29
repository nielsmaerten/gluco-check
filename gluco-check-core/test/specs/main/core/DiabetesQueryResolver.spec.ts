/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

const stub_ResponseFormatter = {
  buildErrorResponse: jest.fn(),
  buildResponse: jest.fn(),
} as any;

import DiabetesQueryResolver from '../../../../src/main/core/DiabetesQueryResolver';
import ResponseFormatter from '../../../../src/main/core/ResponseFormatter';
import {Container} from 'inversify';
import NightscoutProps from '../../../../src/types/NightscoutProps';
import DiabetesQuery from '../../../../src/types/DiabetesQuery';
import {DiabetesPointer} from '../../../../src/types/DiabetesPointer';
import AxiosMockAdapter from '../../../stubs/AxiosMockAdapter';

describe('Diabetes Query Resolver', () => {
  let testQuery: DiabetesQuery;
  const container = getTestContainer();
  const diabetesQueryResolver = container.get(DiabetesQueryResolver);
  AxiosMockAdapter.respondWithMockData();

  beforeEach(() => {
    stub_ResponseFormatter.buildErrorResponse.mockReset();
    stub_ResponseFormatter.buildResponse.mockReset();

    testQuery = {
      // TODO: replace with fakeDiabetesQuery
      locale: 'en-US',
      metadata: {mentionHealthDisclaimer: true, mentionMissingPointers: true},
      pointers: [DiabetesPointer.BloodSugar, DiabetesPointer.CannulaAge],
      user: {
        exists: true,
        userId: '',
        nightscout: new NightscoutProps('https://cgm.example.com', ''),
      },
    };
  });

  it('calls formatError when user is not found', async () => {
    testQuery.user.exists = false;
    await diabetesQueryResolver.resolve(testQuery);

    expect(stub_ResponseFormatter.buildErrorResponse).toHaveBeenCalled();
    expect(stub_ResponseFormatter.buildResponse).not.toHaveBeenCalled();
  });

  it('calls formatError when user exists but has no Nightscout site', async () => {
    testQuery.user.nightscout = undefined;
    await diabetesQueryResolver.resolve(testQuery);

    expect(stub_ResponseFormatter.buildErrorResponse).toHaveBeenCalled();
    expect(stub_ResponseFormatter.buildResponse).not.toHaveBeenCalled();
  });

  it('calls formatResponse when query has a user and nightscout site', async () => {
    await diabetesQueryResolver.resolve(testQuery);

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
