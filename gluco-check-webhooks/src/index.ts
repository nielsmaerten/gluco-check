import * as functions from 'firebase-functions';
import conversationHandler from './conversation';
import validationHandler from './url-validation';
const logTag = '[Webhook.Main]';

export const validateNightscoutUrl = functions.https.onRequest((req, res) => {
  return validationHandler(req, res);
});

export const conversation = functions.https.onRequest((request, response) => {
  // Get the version of the Action calling the webhook
  // Search 'actionVersion' in the 'core' package
  const actionVersion = request.query['v']?.toString();
  request.headers['gluco-check-version'] = actionVersion;
  functions.logger.info(`${logTag} Invoked using Action v1`);

  // Pass request and response objects to the Assistant App.
  conversationHandler.Instance(request, response);
});
