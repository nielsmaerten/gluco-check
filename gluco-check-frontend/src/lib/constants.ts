import { BloodGlucoseUnit } from "./enums";

// firestore
export const FIRESTORE_FIELD_PATH_GLUCOSE_UNITS = "glucoseUnit";
export const FIRESTORE_FIELD_PATH_NIGHTSCOUT = "nightscout";
export const FIRESTORE_FIELD_PATH_DEFAULT_METRICS = "defaultMetrics";
export const FIRESTORE_FIELD_PATH_NIGHTSCOUT_URL = `${FIRESTORE_FIELD_PATH_NIGHTSCOUT}.url`;
export const FIRESTORE_FIELD_PATH_NIGHTSCOUT_TOKEN = `${FIRESTORE_FIELD_PATH_NIGHTSCOUT}.token`;
export const FIRESTORE_FIELD_HEARD_DISCLAIMER = "heardDisclaimer";

// gluco check
export const NIGHTSCOUT_VALIDATION_ENDPOINT_URL =
  process.env.REACT_APP_NIGHTSCOUT_VALIDATION_ENDPOINT_URL || "";

// configuration
export const ALERT_AUTOHIDE_DURATION = 7000;
export const VALIDATION_DEBOUNCE_DURATION = 500;
export const DEFAULT_ONBOARDING_CAROUSEL_INTERVAL = 5000;
export const DEFAULT_GLUCOSE_UNITS = BloodGlucoseUnit.mmol;

// urls
export const TERMS_AND_CONDITIONS_URL = "/terms";
export const HEALTH_DISCLAIMER_URL = "/terms";
export const PRIVACY_URL = "/terms";
export const NIGHTSCOUT_PROJECT_URL = "http://nightscout.info/";
export const FAQS_URL = "/faq";
export const GLUCO_CHECK_GITHUB_URL =
  "https://github.com/nielsmaerten/gluco-check";

export const APP_DEBUG = process.env.REACT_APP_DEBUG === "true" || false;
