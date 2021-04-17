import { BloodGlucoseUnit, DiabetesMetric } from "./enums";
import { GlucoCheckUserDocument } from "./types";

export const FIRESTORE_DEFAULT_SET_OPTIONS: firebase.firestore.SetOptions = {
  mergeFields: [
    "defaultMetrics",
    "glucoseUnit",
    "nightscout.token",
    "nightscout.url",
  ],
};

export const DEFAULT_USER_DOCUMENT: GlucoCheckUserDocument = {
  defaultMetrics: [DiabetesMetric.BloodSugar],
  glucoseUnit: BloodGlucoseUnit.mgdl,
  nightscout: {
    token: "",
    url: "",
  },
};

export const getDocumentPathForUser = (user: firebase.User): string => {
  return `users/${user.email}`;
};
