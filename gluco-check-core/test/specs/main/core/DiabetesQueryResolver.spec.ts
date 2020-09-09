/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

const stub_ResponseFormatter = {
  formatError: jest.fn(),
  formatSnapshot: jest.fn(),
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
    stub_ResponseFormatter.formatError.mockReset();
    stub_ResponseFormatter.formatError.mockReset();

    testQuery = {
      locale: 'en-US',
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

    expect(stub_ResponseFormatter.formatError).toHaveBeenCalled();
    expect(stub_ResponseFormatter.formatSnapshot).not.toHaveBeenCalled();
  });

  it('calls formatError when user exists but has no Nightscout site', async () => {
    testQuery.user.nightscout = undefined;
    await diabetesQueryResolver.resolve(testQuery);

    expect(stub_ResponseFormatter.formatError).toHaveBeenCalled();
    expect(stub_ResponseFormatter.formatSnapshot).not.toHaveBeenCalled();
  });

  it('calls formatResponse when query has a user and nightscout site', async () => {
    await diabetesQueryResolver.resolve(testQuery);

    expect(stub_ResponseFormatter.formatError).not.toHaveBeenCalled();
    expect(stub_ResponseFormatter.formatSnapshot).toHaveBeenCalled();
  });
});

function getTestContainer() {
  const c = new Container();
  c.bind(ResponseFormatter).toConstantValue(stub_ResponseFormatter);
  c.bind(DiabetesQueryResolver).toSelf();
  return c;
}
