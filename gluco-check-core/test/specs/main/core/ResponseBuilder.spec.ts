/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

// Mock the Humanizer before importing anything else
jest.doMock('../../../../src/main/i18n/humanizers');
import Humanizer from '../../../../src/main/i18n/humanizers';
const mockedHumanizer = Humanizer as any;
mockedHumanizer.dmSnapshot.mockReturnValue(['TEST']);
mockedHumanizer.error.mockReturnValue('ERROR');
mockedHumanizer.disclaimer.mockReturnValue('IANAD');

import getFakeQuery from '../../../fakes/objects/fakeDmQuery';
import ResponseBuilder from '../../../../src/main/core/ResponseBuilder';
import DmSnapshot from '../../../../src/types/DmSnapshot';
import {ErrorType} from '../../../../src/types/ErrorType';
import {DmMetric} from '../../../../src/types/DmMetric';
import UserProfileClient from '../../../stubs/UserProfileClient';

const mock_i18n = {
  ensureLocale: jest.fn(),
};

const fakeSnapshot = new DmSnapshot({
  timestamp: Date.now(),
  query: getFakeQuery(),
});

const mock_userClient = new UserProfileClient();

describe('Response Builder', () => {
  const responseFormatter = new ResponseBuilder(mock_i18n as any, mock_userClient as any);

  it('detects general errors', async () => {
    const possibleGeneralErrors = [
      ErrorType.Firebase_UserNotFound,
      ErrorType.Nightscout_Unauthorized,
      ErrorType.Nightscout_Unavailable,
    ];
    const snapshot = Object.assign({}, fakeSnapshot);

    for (let i = 0; i < possibleGeneralErrors.length; i++) {
      snapshot.errors = [
        {type: possibleGeneralErrors[i], affectedMetric: DmMetric.Everything},
      ];
      const result = await responseFormatter.build(snapshot);
      expect(result.SSML).toEqual('<speak><s>ERROR</s> <s>IANAD</s></speak>');
    }
  });

  it('builds a snapshot', async () => {
    const snapshot = Object.assign({}, fakeSnapshot);
    const result = await responseFormatter.build(snapshot);
    expect(result.SSML).toEqual('<speak><s>TEST</s> <s>IANAD</s></speak>');
  });
});
