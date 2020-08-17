import * as functions from 'firebase-functions';
import conversationHandler from './conversation';
import {performance} from 'perf_hooks';
import {nanoid} from 'nanoid/non-secure';

export const validateNightscoutUrl = functions.https.onRequest(
  require('./url-validation')
);

export const conversation = functions.https.onRequest(async (request, response) => {
  // HTTP Request accepted. Save starting time.
  const start = performance.now();

  // Generate a unique ID to track this request
  const requestId = nanoid();
  functions.logger.debug(`[${requestId}] Start processing new Assistant request`);
  request.headers['gluco-check-request-id'] = requestId;

  // Pass request and response objects to the Assistant App.
  await conversationHandler.Instance(request, response);

  // Request finished. Calculate total elapsed time.
  const stop = performance.now();
  const elapsed = Math.floor(stop - start);

  // Write log message and exit.
  functions.logger.write({
    message: `[${requestId}] Assistant request completed in ${elapsed} ms.`,
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
