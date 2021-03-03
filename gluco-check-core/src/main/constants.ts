import {DmMetric} from '../types/DmMetric';
import {GlucoseUnit} from '../types/GlucoseUnit';

// Action will mention this url when user needs to be directed to the frontend app
export const gc_url = 'https://diabase.app';

// Minimum supported version of Nightscout
export const nightscoutMinVersion = '13.0.0';

// Google uses test accounts to review the Action before it goes live
// Reviewer accounts are automatically populated with the following data:
export const aogAgentRegex = /^aog\.platform.*@gmail\.com$/;
export const sampleData = {
  defaultMetrics: [DmMetric.BloodSugar, DmMetric.CarbsOnBoard],
  glucoseUnit: GlucoseUnit.mgDl,
};
