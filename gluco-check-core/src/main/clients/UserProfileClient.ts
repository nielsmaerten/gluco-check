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
}
