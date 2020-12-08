/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

import QueryResolver from '../../../../src/main/core/QueryResolver';
import AxiosMockAdapter from '../../../stubs/AxiosMockAdapter';
import getFakeQuery from '../../../fakes/objects/fakeDmQuery';
import {ErrorType} from '../../../../src/types/ErrorType';

describe('QueryResolver', () => {
  AxiosMockAdapter.respondWithMockData();

  it('returns an error when user does not exist', async () => {
    const fakeQuery = getFakeQuery();
    fakeQuery.user.exists = false;
    const result = await new QueryResolver().buildSnapshot(fakeQuery);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].type).toBe(ErrorType.Firebase_UserNotFound);
  });

  it('returns an error when user has no Nightscout site', async () => {
    const fakeQuery = getFakeQuery();
    fakeQuery.user.nightscout = undefined;
    const result = await new QueryResolver().buildSnapshot(fakeQuery);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].type).toBe(ErrorType.Firebase_UserNotFound);
  });

  it('builds a Snapshot by querying Nightscout', async () => {
    const fakeQuery = getFakeQuery();
    const result = await new QueryResolver().buildSnapshot(fakeQuery);
    expect(result.cannulaInserted).toBeDefined();
    expect(result.glucoseValue()).toBeDefined();
    expect(result.carbsOnBoard).toBeDefined();
  });
});
