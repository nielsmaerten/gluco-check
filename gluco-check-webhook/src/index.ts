import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const validateNightscoutUrl = functions.https.onRequest((req, res) => {
  functions.logger.info('Validating Nightscout URL');
  res.status(500).send('Not implemented.');
});
