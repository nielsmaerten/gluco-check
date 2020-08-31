import 'reflect-metadata';
import ResponseFormatter from '../../../../src/main/core/ResponseFormatter';
import Localizer from '../../../../src/main/i18n';
import DiabetesSnapshot from '../../../../src/types/DiabetesSnapshot';
import {GlucoseTrend} from '../../../../src/types/GlucoseTrend';
import {GlucoseUnit} from '../../../../src/types/GlucoseUnit';
import DiabetesQuery from '../../../../src/types/DiabetesQuery';
import {DiabetesPointer} from '../../../../src/types/DiabetesPointer';
import User from '../../../../src/types/User';

describe('Response Formatter', () => {
  const testQuery: DiabetesQuery = {
    locale: 'en-US',
    pointers: [DiabetesPointer.BloodSugar],
    user: new User(),
  };

  const testSnapshot = {
    ...new DiabetesSnapshot(Date.now()),
    glucoseValueMgDl: 102,
    glucoseTrend: GlucoseTrend.Stable,
    glucoseUnit: GlucoseUnit.mgDl,
  } as DiabetesSnapshot;

  const responseFormatter = new ResponseFormatter(new Localizer());

  it('generates SSML from a DiabetesSnapshot', async () => {
    const response = await responseFormatter.formatSnapshot(testSnapshot, testQuery);
    expect(response.SSML).toEqual('102 and stable as of a few seconds ago.');
  });
});
