import 'reflect-metadata';
debugger;
jest.autoMockOn();
jest.doMock('../../../../src/main/i18n');
jest.doMock('i18next');
require('i18next').init.mockImplementation(jest.fn());
jest.doMock('../../../../src/main/i18n/Formatters');
import ResponseFormatter from '../../../../src/main/core/ResponseFormatter';
import DiabetesSnapshot from '../../../../src/types/DiabetesSnapshot';
import DiabetesQuery from '../../../../src/types/DiabetesQuery';
import {DiabetesPointer} from '../../../../src/types/DiabetesPointer';
import User from '../../../../src/types/User';


describe('Response Formatter', () => {
  const testQuery: DiabetesQuery = {
    locale: 'en-US',
    pointers: [DiabetesPointer.Everything],
    user: new User(),
  };
  debugger;
  

  const testSnapshot = new DiabetesSnapshot(Date.now());

  const responseFormatter = new ResponseFormatter(jest.createMockFromModule('../../../../src/main/i18n'));

  it('combines formatted pointers into SSML', async () => {
    const response = await responseFormatter.formatSnapshot(testSnapshot, testQuery);
  });
});

