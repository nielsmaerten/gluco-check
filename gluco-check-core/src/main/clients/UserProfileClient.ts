/* istanbul ignore file: External system (Firebase) */
import {injectable} from 'inversify';
import {logger} from 'firebase-functions';
import FirebaseClient from './FirebaseClient';
import User from '../../types/User';

@injectable()
/**
 * Provides methods for interacting with the Users collection in Firestore
 */
export default class UserProfileClient {
  private users = this.firebaseClient.firestore().collection('users');

  constructor(private firebaseClient: FirebaseClient) {
    logger.info('[UserProfileClient]: Initializing new instance');
  }

  async getUser(userId: string): Promise<User> {
    const userDocument = await this.users.doc(userId).get();
    if (userDocument.exists) {
      return {
        userId,
        exists: true,
        ...userDocument.data(),
      };
    } else {
      return {userId, exists: false};
    }
  }

  async flagDisclaimer(user: User, userHeardDisclaimer: boolean, awaitFirestore = true) {
    // We only need to set heardDisclaimer to TRUE if:
    // - the user hasn't heard the disclaimer before
    // - AND they heard it just now
    const heardDisclaimerBefore = user.heardDisclaimer === true;
    const heardDisclaimerNow = userHeardDisclaimer;

    const shouldUpdate = !heardDisclaimerBefore && heardDisclaimerNow;
    if (!shouldUpdate) return;

    const userRef = this.users.doc(user.userId);
    const userDoc: Partial<User> = {heardDisclaimer: true};
    const promise = userRef.set(userDoc, {merge: true});

    // HACK: This is possibly dangerous!
    // We don't await this call, so we can save a couple milliseconds
    // There's a small chance the flag won't be updated on the first try
    if (awaitFirestore) return promise;
    else return null;
  }
}
