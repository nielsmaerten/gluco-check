import DmQuery from '../../../src/types/DmQuery';
import User from '../../../src/types/User';
import {DmMetric} from '../../../src/types/DmMetric';

describe('DiabetesQuery', () => {
  it("expands the 'Everything' type to all other types", () => {
    const query = new DmQuery(new User(), 'en-US', [DmMetric.Everything]);

    expect(query.metrics).toContain(DmMetric.BloodSugar);
    expect(query.metrics).toContain(DmMetric.CannulaAge);
    expect(query.metrics).toContain(DmMetric.CarbsOnBoard);
    expect(query.metrics).toContain(DmMetric.InsulinOnBoard);
    expect(query.metrics).toContain(DmMetric.SensorAge);
    expect(query.metrics).toContain(DmMetric.PumpBattery);
    expect(query.metrics).not.toContain(DmMetric.Everything);
    expect(query.metrics).toHaveLength(6);
  });
});
