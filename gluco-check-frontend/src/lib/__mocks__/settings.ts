import { BloodGlucoseUnit, DiabetesMetric } from "../enums";
import { SettingsFormData } from "../types";

export const mockFormData: SettingsFormData = {
  defaultMetrics: [DiabetesMetric.BloodSugar],
  nightscoutToken: "I am a token",
  nightscoutUrl: "https://example.com",
  glucoseUnit: BloodGlucoseUnit.mgdl,
};
