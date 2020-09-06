/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

const mock_i18n = {
  ensureLocale: jest.fn(),
};

jest.doMock('../../../../src/main/i18n/Formatters');

import ResponseFormatter from '../../../../src/main/core/ResponseFormatter';
import DiabetesSnapshot from '../../../../src/types/DiabetesSnapshot';
import DiabetesQuery from '../../../../src/types/DiabetesQuery';
import {DiabetesPointer} from '../../../../src/types/DiabetesPointer';
import User from '../../../../src/types/User';
import * as Formatters from '../../../../src/main/i18n/Formatters';

(Formatters as any).formatBloodSugar.mockReturnValue('BG');
(Formatters as any).formatCannulaAge.mockReturnValue('CAGE');
(Formatters as any).formatInsulinOnBoard.mockReturnValue('IOB');
(Formatters as any).formatSensorAge.mockReturnValue('SAGE');
(Formatters as any).formatCarbsOnBoard.mockReturnValue('COB');

describe('Response Formatter', () => {
  const testQuery: DiabetesQuery = {
    locale: 'en-US',
    pointers: [
      DiabetesPointer.BloodSugar,
      DiabetesPointer.CannulaAge,
      DiabetesPointer.InsulinOnBoard,
      DiabetesPointer.SensorAge,
      DiabetesPointer.CarbsOnBoard,
    ],
    user: new User(),
  };

  const testSnapshot = new DiabetesSnapshot(Date.now());
  const responseFormatter = new ResponseFormatter(mock_i18n as any);

  it('combines formatted pointers into SSML', async () => {
    const response = await responseFormatter.formatSnapshot(testSnapshot, testQuery);
    expect(response.SSML).toEqual(
      '<speak><s>BG</s><s>CAGE</s><s>IOB</s><s>SAGE</s><s>COB</s></speak>'
    );
  });
});
