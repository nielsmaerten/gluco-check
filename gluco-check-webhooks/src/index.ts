import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const validateNightscoutUrl = functions.https.onRequest(
  require('./url-validation')
);
export const dialogflow = functions.https.onRequest(require('./dialogflow'));
