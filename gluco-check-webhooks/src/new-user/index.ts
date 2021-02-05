import {firestore} from 'firebase-admin';
import {auth, config} from 'firebase-functions';

const newUserHandler = async (user: auth.UserRecord) => {
  if (!user.email?.startsWith('aog.platform')) {
    return;
  }

  const userDocumentRef = firestore().doc(`users/${user.email}`);
  const userDocument = {
    defaultMetrics: ['blood sugar', 'insulin on board', 'carbs on board'],
    glucoseUnit: 'mg/dl',
    nightscout: config().nightscout_for_testers,
  };

  await userDocumentRef.set(userDocument, {merge: true});
};

export default newUserHandler;
