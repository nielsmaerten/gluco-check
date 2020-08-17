import * as functions from 'firebase-functions';
import conversationHandler from './conversation';
import {performance} from 'perf_hooks';

export const validateNightscoutUrl = functions.https.onRequest(
  require('./url-validation')
);

export const conversation = functions.https.onRequest(async (request, response) => {
  // HTTP Request accepted. Save starting time.
  const start = performance.now();
  functions.logger.debug('Start processing new Assistant request');

  // Get the version of the Action calling the webhook
  request.headers['gluco-check-version'] = request.query['v']?.toString();

  // Pass request and response objects to the Assistant App.
  await conversationHandler.Instance(request, response);

  // Request finished. Calculate total elapsed time.
  const stop = performance.now();
  const elapsed = Math.floor(stop - start);

  // Write log message and exit.
  functions.logger.write({
    message: `Assistant request completed in ${elapsed} ms.`,
    severity: getLogSeverity(elapsed),
  });
});

const getLogSeverity = (elapsedMs: number) => {
  let severity: functions.logger.LogSeverity;
  if (elapsedMs < 2000) severity = 'INFO';
  else if (elapsedMs < 3000) severity = 'WARNING';
  else severity = 'ALERT';
  return severity;
};
