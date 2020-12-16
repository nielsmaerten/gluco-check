/* istanbul ignore file: External system (Firebase) */
import {initializeApp, firestore, apps} from 'firebase-admin';
import {injectable} from 'inversify';
import {logger} from 'firebase-functions';

@injectable()
export default class FirebaseClient {
  constructor() {
    const alreadyInitialized = apps.length > 0;
    if (alreadyInitialized) return;

    logger.debug('[FirebaseClient]: Initializing Firebase App');
    initializeApp();
  }

  public firestore = firestore;
}
