import * as functions from 'firebase-functions';
import GlucoCheckCore from 'gluco-check-core';

export default async (req: functions.https.Request, res: functions.Response) => {
  // Set CORS Headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');

  switch (req.method.toUpperCase()) {
    case 'OPTIONS':
      res.status(204).send('');
      break;

    case 'POST': {
      const {url, token} = req.body;
      const result = await GlucoCheckCore.validate({url, token});
      res.status(200).send(result);
      break;
    }

    default:
      res.status(405).send('');
      break;
  }
};
