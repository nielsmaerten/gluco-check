import * as functions from 'firebase-functions';
import dialogflowAppFactory from './dialogflow';
import {performance} from 'perf_hooks';
import {nanoid} from 'nanoid/non-secure';

export const validateNightscoutUrl = functions.https.onRequest(
  require('./url-validation')
);

export const dialogflow = functions.https.onRequest(
  async (request, response) => {
    // HTTP Request accepted. Save starting time.
    const start = performance.now();
    const execId = nanoid();
    functions.logger.debug(`New DialogFlow request: ${execId}`);
    request.headers['gluco-check-exec-id'] = execId;

    // Pass request and response objects to the DialogFlow App.
    await dialogflowAppFactory.Instance(request, response);

    // Request finished. Calculate total elapsed time.
    const stop = performance.now();
    const elapsed = Math.floor(stop - start);

    // Write log message and exit.
    functions.logger.write({
      message: `DialogFlow request ${execId} completed in ${elapsed} ms.`,
      severity: getLogSeverity(elapsed),
    });
  }
);

const getLogSeverity = (elapsedMs: number) => {
  let severity: functions.logger.LogSeverity;
  if (elapsedMs < 2000) severity = 'INFO';
  else if (elapsedMs < 3000) severity = 'WARNING';
  else severity = 'ALERT';
  return severity;
};
