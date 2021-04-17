import { BloodGlucoseUnit, NightscoutBloodGlucoseUnit } from "./enums";

export const NightscoutBloodGlucoseUnitMapping = {
  [BloodGlucoseUnit.mgdl]: NightscoutBloodGlucoseUnit.mgdl,
  [BloodGlucoseUnit.mmol]: NightscoutBloodGlucoseUnit.mmol,
};
