import {nightscoutMinVersion} from '../main/constants';
import {DmMetric} from './DmMetric';
import {GlucoseUnit} from './GlucoseUnit';

export default class NightscoutValidationResult {
  constructor() {}
  public url = {
    /**
     * BaseURL: '  https://cgm.example.com/foo?bar=xyz  ' -> 'https://cgm.example.com'
     * This value must be stored in UserProfile
     */
    parsed: '',

    // TRUE if input was successfully parsed as a URL
    isValid: false,

    // TRUE if we found a Nightscout site at this URL
    pointsToNightscout: false,
  };

  public token = {
    // Whitespace-trimmed token
    // This value must be stored in UserProfile
    parsed: '',

    // TRUE if the token has the required permissions
    isValid: false,
  };

  public nightscout = {
    // Version of Nightscout. Empty if no Nightscout site was detected OR the token is invalid
    version: '',

    // mg/dl or mmol/l
    // Should be stored in UserProfile. User can override
    glucoseUnit: '' as GlucoseUnit,

    // if (version < minSupportedVersion): not all features will be available
    minSupportedVersion: nightscoutMinVersion,
  };

  // All metrics we could find. Note that if a metric is missing here,
  // it doesn't necessarily mean it won't be available in the future
  public discoveredMetrics: DmMetric[] = [];
}
