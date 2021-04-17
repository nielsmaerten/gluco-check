import { BloodGlucoseUnit, DiabetesMetric } from "./enums";

export interface GlucoCheckUserDocument {
  heardDisclaimer?: boolean;
  defaultMetrics: DiabetesMetric[];
  glucoseUnit: BloodGlucoseUnit;
  nightscout: {
    token: string;
    url: string;
  };
}

export type SettingsFormData = {
  defaultMetrics: DiabetesMetric[];
  nightscoutUrl: string;
  nightscoutToken: string;
  glucoseUnit: BloodGlucoseUnit;
};

export interface NightscoutValidationEndpointRequest {
  url: string;
  token: string;
}
