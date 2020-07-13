import {dialogflow, OmniHandler} from 'actions-on-google';
import * as functions from 'firebase-functions';

enum Intents {
  Default = 'Default Intent',
  SignIn = 'Sign In',
}

export default class DialogflowAppFactory {
  private static _instance: DialogflowAppFactory;
  private dialogflowApp: OmniHandler;

  private constructor() {
    functions.logger.debug('Initializing new Dialogflow App');
    this.dialogflowApp = this.initDialogflowApp();
  }

  public static get Instance() {
    if (!this._instance) this._instance = new this();
    return this._instance.dialogflowApp;
  }

  private initDialogflowApp() {
    const config = functions.config();

    const dialogflowApp = dialogflow({
      clientId: config.dialogflow.client_id,
    });

    dialogflowApp.intent(Intents.Default, require('./handlers/Default'));
    dialogflowApp.intent(Intents.SignIn, require('./handlers/SignIn'));
    dialogflowApp.fallback(Intents.Default);

    return dialogflowApp;
  }
}
