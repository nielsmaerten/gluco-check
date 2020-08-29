/**
 * A GlucoseTrend indicates how the blood sugar level has been changing over the last few minutes
 */
export enum GlucoseTrend {
  RisingRapidly = 'DoubleUp',
  Rising = 'SingleUp',
  RisingSlowly = 'SlightUp',

  Stable = 'Stable',

  FallingSlowly = 'SlightDown',
  Falling = 'SingleDown',
  FallingRapidly = 'DoubleDown',

  Unknown = 'Unknown',
}
