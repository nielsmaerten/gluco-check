/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

const mock_i18n = {
  ensureLocale: jest.fn(),
};

jest.doMock('../../../../src/main/i18n/humanizers');

import ResponseFormatter from '../../../../src/main/core/ResponseFormatter';
import DmSnapshot from '../../../../src/types/DmSnapshot';
import Humanizer from '../../../../src/main/i18n/humanizers';
import getFakeQuery from '../../../fakes/objects/fakeDiabetesQuery';

const fakeQuery = getFakeQuery();
const mockedHumanizer = Humanizer as any;
mockedHumanizer.bloodSugar.mockReturnValue('BG');
mockedHumanizer.cannulaAge.mockReturnValue('CAGE');
mockedHumanizer.insulinOnBoard.mockReturnValue('IOB');
mockedHumanizer.sensorAge.mockReturnValue('SAGE');
mockedHumanizer.carbsOnBoard.mockReturnValue('COB');
mockedHumanizer.pumpBattery.mockReturnValue('PB');
mockedHumanizer.error.mockReturnValue('ERROR');

describe('Response Formatter', () => {
  const testSnapshot = new DmSnapshot(Date.now(), fakeQuery);
  const responseFormatter = new ResponseFormatter(mock_i18n as any);

  it('combines formatted metrics into SSML', async () => {
    const response = await responseFormatter.buildResponse(testSnapshot, fakeQuery);
    expect(response.SSML).toEqual(
      '<speak><s>BG </s><s>CAGE </s><s>IOB </s><s>SAGE </s><s>COB </s><s>PB </s></speak>'
    );
  });

  it('calls error Humanizer for error responses', async () => {
    const response = await responseFormatter.buildErrorResponse(null as any, fakeQuery);
    expect(response.SSML).toEqual('<speak>ERROR</speak>');
  });
});
