import * as functions from 'firebase-functions';
import conversationHandler from './conversation';

export const validateNightscoutUrl = functions.https.onRequest(
  require('./url-validation')
);

export const conversation = functions.https.onRequest((request, response) => {
  // Get the version of the Action calling the webhook
  // Search 'actionVersion' in the 'core' package
  const actionVersion = request.query['v']?.toString();
  request.headers['gluco-check-version'] = actionVersion;
  functions.logger.info(
    `[Webhook]: Caller is using 'gluco-check-action@v${actionVersion}'`
  );

  // Pass request and response objects to the Assistant App.
  conversationHandler.Instance(request, response);
});
