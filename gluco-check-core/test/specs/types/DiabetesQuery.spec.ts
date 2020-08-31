import DiabetesQuery from '../../../src/types/DiabetesQuery';
import User from '../../../src/types/User';
import {DiabetesPointer} from '../../../src/types/DiabetesPointer';

describe('DiabetesQuery', () => {
  it("expands the 'Everything' type to all other types", () => {
    const query = new DiabetesQuery(new User(), 'en-US', [DiabetesPointer.Everything]);

    expect(query.pointers).toContain(DiabetesPointer.BloodSugar);
    expect(query.pointers).toContain(DiabetesPointer.CannulaAge);
    expect(query.pointers).toContain(DiabetesPointer.CarbsOnBoard);
    expect(query.pointers).toContain(DiabetesPointer.InsulinOnBoard);
    expect(query.pointers).toContain(DiabetesPointer.SensorAge);
    expect(query.pointers).toContain(DiabetesPointer.PumpBattery);
    expect(query.pointers).not.toContain(DiabetesPointer.Everything);
    expect(query.pointers).toHaveLength(6);
  });
});
