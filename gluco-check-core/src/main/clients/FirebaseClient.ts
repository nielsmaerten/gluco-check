/* istanbul ignore file: External system (Firebase) */
import {initializeApp, firestore} from 'firebase-admin';
import {injectable} from 'inversify';
import {logger} from 'firebase-functions';

@injectable()
export default class FirebaseClient {
  constructor() {
    logger.debug('[FirebaseClient]: Initializing Firebase App');
    initializeApp();
  }

  public firestore = firestore;
}
