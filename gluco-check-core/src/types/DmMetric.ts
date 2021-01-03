/**
 * A DmMetric is a piece of information about someone's diabetes.
 * For example: at 10 AM, my blood sugar was 123mg/dl, and my carbs on board was 15g
 * This statement has 2 DmMetrics: BloodSugar and CarbsOnBoard
 */
export enum DmMetric {
  Everything = 'everything',
  BloodSugar = 'blood sugar',
  InsulinOnBoard = 'insulin on board',
  CarbsOnBoard = 'carbs on board',
  SensorAge = 'sensor age',
  CannulaAge = 'cannula age',
  PumpBattery = 'pump battery',
  PumpReservoir = 'pump reservoir',
}

// Note:
// The names of these enum values correspond to the type 'DmMetric' in Google Actions:
// https://console.actions.google.com/project/gluco-check-nightly/types/edit/DmMetric
// https://console.actions.google.com/project/gluco-check-prod/types/edit/DmMetric
