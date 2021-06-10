/**
 * Following the discovery of this bug:
 * https://github.com/nielsmaerten/gluco-check/issues/130
 *
 * This function will go through all userDocuments and
 * - fetch their unit from Nightscout
 * - set this unit in their userDocument
 *
 * TODO: Once #130 has been fixed, this function should be deleted again.
 */

import * as admin from 'firebase-admin';
import {Response} from 'firebase-functions';
import GlucoCheckCore from 'gluco-check-core';

const logTag = '[FixUnits]';
const batchSize = 100;

type ValidationResult = {
  token: {
    isValid: boolean;
    parsed: string;
  };
  url: {
    parsed: string;
    isValid: boolean;
    pointsToNightscout: boolean;
  };
  nightscout: {
    minSupportedVersion: string;
    glucoseUnit: string;
    version: string;
  };
  discoveredMetrics: string[];
};

export default async function fixUnits(req: Express.Request, res: Response) {
  // Select some users that aren't verified
  const query = admin
    .firestore()
    .collection('users')
    .where('glucoseUnit', '>=', '')
    .limit(batchSize);

  // Run query
  const users = await query.get();
  const promises = users.docs.map(async userSnapshot => {
    const userDocument = userSnapshot.data();
    const nightscoutConf = userDocument.nightscout;

    // Call our own 'validation' endpoint
    const validation: ValidationResult = await GlucoCheckCore.validate(nightscoutConf);

    // Abort if validation was unsuccessful
    if (!validation.url.pointsToNightscout) {
      console.warn(
        logTag,
        '[ABORT]',
        userSnapshot.id,
        'does not have a valid NS configuration. Aborting.'
      );
      return;
    }

    // What unit is set on this Nightscout site?
    const nightscoutUnitString = validation.nightscout.glucoseUnit;
    const isMmolL = nightscoutUnitString.toLowerCase().startsWith('mmol');
    const glucoCheckUnit = isMmolL ? 'mmol/L' : 'mg/dl';

    // Update the user document
    if (glucoCheckUnit === userDocument.glucoseUnit) {
      console.log(
        logTag,
        '[SKIP]',
        userSnapshot.id,
        'has matching glucoseUnit. Not updating.'
      );
      return;
    } else {
      console.log(
        logTag,
        '[UPDATE]',
        `${userSnapshot.id}'s`,
        'glucoseUnit to',
        glucoCheckUnit
      );
      return userSnapshot.ref.set(
        {glucoseUnit: glucoCheckUnit, checkedUnit: true},
        {merge: true}
      );
    }
  });

  await Promise.all(promises);
  console.log(logTag, 'Batch of', users.size, 'users finished.');
  res.send('completed');
}
