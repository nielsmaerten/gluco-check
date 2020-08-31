/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import DiabetesQueryResolver from '../../../../src/main/core/DiabetesQueryResolver';
import ResponseFormatter from '../../../../src/main/core/ResponseFormatter';
import {Container} from 'inversify';
import NightscoutProps from '../../../../src/types/NightscoutProps';
import DiabetesQuery from '../../../../src/types/DiabetesQuery';
import stub_ResponseFormatter = require('../../../stubs/ResponseFormatter');

describe('Diabetes Query Resolver', () => {
  beforeEach(() => {
    stub_ResponseFormatter.formatError.mockReset();
    stub_ResponseFormatter.formatError.mockReset();
  });
  const container = getTestContainer();
  const diabetesQueryResolver = container.get(DiabetesQueryResolver);
  const testQuery: DiabetesQuery = {
    locale: 'en-US',
    pointers: [],
    user: {
      exists: false,
      userId: '',
      nightscout: new NightscoutProps('', ''),
    },
  };

  it('calls formatError when user is not found', () => {
    testQuery.user.exists = false;
    testQuery.user.nightscout = new NightscoutProps('', '');
    diabetesQueryResolver.resolve(testQuery);

    expect(stub_ResponseFormatter.formatError).toHaveBeenCalled();
    expect(stub_ResponseFormatter.formatSnapshot).not.toHaveBeenCalled();
  });

  it('calls formatError when no nightscout site is defined', () => {
    testQuery.user.exists = true;
    testQuery.user.nightscout = undefined;
    diabetesQueryResolver.resolve(testQuery);

    expect(stub_ResponseFormatter.formatError).toHaveBeenCalled();
    expect(stub_ResponseFormatter.formatSnapshot).not.toHaveBeenCalled();
  });

  it('calls formatResponse when query has a user and nightscout site', () => {
    testQuery.user.exists = true;
    testQuery.user.nightscout = new NightscoutProps('', '');
    diabetesQueryResolver.resolve(testQuery);

    expect(stub_ResponseFormatter.formatError).not.toHaveBeenCalled();
    expect(stub_ResponseFormatter.formatSnapshot).toHaveBeenCalled();
  });
});

function getTestContainer() {
  const c = new Container();
  c.bind(ResponseFormatter).toConstantValue(stub_ResponseFormatter as any);
  c.bind(DiabetesQueryResolver).toSelf();
  return c;
}
