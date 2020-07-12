import * as functions from 'firebase-functions';

export default async (
  req: functions.https.Request,
  res: functions.Response
) => {
  res.status(500).send('Not implemented.');
};
