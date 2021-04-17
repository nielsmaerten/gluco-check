import { BloodGlucoseUnit, DiabetesMetric } from "../enums";
import { GlucoCheckUserDocument } from "../types";

export const mockUser: Partial<firebase.User> = {
  email: "example@example.com",
  uid: "uid123",
};

export const mockUserDocument: GlucoCheckUserDocument = {
  heardDisclaimer: false,
  defaultMetrics: [DiabetesMetric.BloodSugar],
  glucoseUnit: BloodGlucoseUnit.mgdl,
  nightscout: {
    url: "https://example.com",
    token: "nstoken123",
  },
};
