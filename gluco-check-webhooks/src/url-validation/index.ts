import * as functions from 'firebase-functions';
import GlucoCheckCore from 'gluco-check-core';

export default async (req: functions.https.Request, res: functions.Response) => {
  // TODO: Change origin to our own domain
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.status(204).send('');
  } else {
    const isPost = req.method.toLowerCase() === 'post';
    if (!isPost) {
      res
        .status(405)
        .send("Use a POST application/json request with 'url' and 'token' properties");
    } else {
      const props = {url: req.body.url, token: req.body.token};
      const result = await GlucoCheckCore.validate(props);
      res.status(200).send(result);
    }
  }
};
