export enum BloodGlucoseUnit {
  mgdl = "mg/dl",
  mmol = "mmol/L",
}

export enum NightscoutBloodGlucoseUnit {
  mgdl = "mg/dl",
  mmol = "mmol",
}

// @TODO: once this repo is properly part of the workspace,
// pull this in from gluco-check-core instead
// These are mapped to translations directly by case name,
// additions or changes here need to be reflected there
export enum DiabetesMetric {
  Everything = "everything",
  BloodSugar = "blood sugar",
  InsulinOnBoard = "insulin on board",
  CarbsOnBoard = "carbs on board",
  SensorAge = "sensor age",
  CannulaAge = "cannula age",
  PumpBattery = "pump battery",
  PumpReservoir = "pump reservoir",
}

export enum AvailableLanguage {
  Dutch = "nl",
  English = "en",
  German = "de",
  Italian = "it",
  Norwegian = "no",
  Spanish = "es",
  Swedish = "sv",
}

// These languages are being tested.
// We'll show a message informing users they have to sign up to get access.
export enum BetaLanguage {
  German = AvailableLanguage.German,
  Italian = AvailableLanguage.Italian,
  Norwegian = AvailableLanguage.Norwegian,
  Spanish = AvailableLanguage.Spanish,
  Swedish = AvailableLanguage.Swedish,
}
