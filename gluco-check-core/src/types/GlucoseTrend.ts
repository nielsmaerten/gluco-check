/**
 * A GlucoseTrend indicates how the blood sugar level has been changing over the last few minutes
 */
export enum GlucoseTrend {
  /* ⇈ */ RisingRapidly = 'DoubleUp',
  /* ⇊ */ FallingRapidly = 'DoubleDown',

  /* ↑ */ Rising = 'SingleUp',
  /* ↓ */ Falling = 'SingleDown',

  /* ↗ */ RisingSlowly = 'SlightUp',
  /* ↘ */ FallingSlowly = 'SlightDown',

  /* → */ Stable = 'Stable',
  /* ? */ Unknown = 'Unknown',
}
