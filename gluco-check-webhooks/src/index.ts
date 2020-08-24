import * as functions from 'firebase-functions';
import conversationHandler from './conversation';

export const validateNightscoutUrl = functions.https.onRequest(
  require('./url-validation')
);

export const conversation = functions.https.onRequest((request, response) => {
  // Get the version of the Action calling the webhook
  const actionVersion = request.query['v']?.toString();
  request.headers['gluco-check-version'] = actionVersion;
  functions.logger.debug(`Assistant Action: v${actionVersion}`);

  // Pass request and response objects to the Assistant App.
  conversationHandler.Instance(request, response);
});
