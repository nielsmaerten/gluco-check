import {nightscoutMinVersion} from '../main/constants';
import {DmMetric} from './DmMetric';
import {GlucoseUnit} from './GlucoseUnit';

export default class NightscoutValidationResult {
  constructor() {}
  public url = {
    /**
     * Extracted BaseUrl
     * eg: '  https://cgm.example.com/foo?bar=xyz  ' -> 'https://cgm.example.com'
     * This value MUST be stored in UserProfile
     */
    parsed: '',

    // TRUE: input was successfully parsed as a URL
    // FALSE: user MUST fix their URL
    isValid: false,

    // TRUE: we found a Nightscout site at this URL
    // FALSE: the user MUST fix their URL
    pointsToNightscout: false,
  };

  public token = {
    // Whitespace-trimmed token
    // This value MUST be stored in UserProfile
    parsed: '',

    // TRUE: the token has the required permissions
    // FALSE: not all features MAY be available. User SHOULD fix their token
    isValid: false,
  };

  public nightscout = {
    // Version of Nightscout
    // EMPTY: no Nightscout site was detected, OR (token is invalid AND site is read protected)
    version: '',

    // mg/dl or mmol/l
    // SHOULD be stored in UserProfile. User CAN override
    glucoseUnit: '' as GlucoseUnit,

    // if (version < minSupportedVersion): not all features will be available
    // User SHOULD be warned when they use an unsupported version
    minSupportedVersion: nightscoutMinVersion,
  };

  // All metrics we could find. If a metric is missing here,
  // it doesn't necessarily mean it won't be available in the future
  // User MAY be warned about unavailable metrics, but SHOULD NOT be prevented from selecting them
  public discoveredMetrics: DmMetric[] = [];
}
