import {logger, config} from 'firebase-functions';
import {injectable} from 'inversify';
import User from '../../types/User';
import FirebaseClient from '../clients/FirebaseClient';
import {sampleData, aogAgentRegex} from '../constants';
const logTag = '[NewUserHook]';

@injectable()
export default class AogReviewHelper {
  constructor(private firebaseClient: FirebaseClient) {}

  /**
   * Creates/Updates profile of the specified user with sample data
   * This is used to provide sample data to Google Action reviewers
   */
  async addSampleData(user: User) {
    // Create reference to user document in Firestore
    const userId = user.userId;
    const userDocumentPath = `users/${userId}`;
    const userDocumentRef = this.firebaseClient.firestore().doc(userDocumentPath);

    // Build user document with sample data
    const userDocument: User = {
      defaultMetrics: sampleData.defaultMetrics,
      glucoseUnit: sampleData.glucoseUnit,
      nightscout: config().nightscout_for_testers,
      exists: true,
      userId: userId,
      heardDisclaimer: false,
    };

    logger.warn(logTag, `Populating test user ${userId} with sample data`);
    await userDocumentRef.set(userDocument, {merge: true});
    Object.assign(user, userDocument);
  }

  /**
   * Returns TRUE if the email address matches that of an AOG platform reviewer
   * @param user The user's email address
   */
  isReviewer(user: User) {
    const email = user.userId;
    const isTestUser = aogAgentRegex.test(email);
    return isTestUser;
  }
}
