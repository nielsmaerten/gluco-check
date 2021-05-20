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
  English = "en",
  // 2021-05-10(Niels): Commenting out Dutch while the Action is being translated,
  // so that we can still push other fixes to PROD without the language showing up
  // Dutch = "nl",
}
