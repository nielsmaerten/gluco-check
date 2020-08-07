import {
  conversation,
  ConversationV3App,
  ConversationV3,
  OmniHandler,
} from '@assistant/conversation';
import {MainHandler, ReadSingleParamHandler} from 'gluco-check-core';
import * as functions from 'firebase-functions';

enum HandlerNames {
  Main = 'Main Invocation',
  ReadSingleParameter = 'Read Single Parameter',
}

export default class ConversationHandler {
  private static _instance: ConversationHandler;
  private app: OmniHandler & ConversationV3App<ConversationV3>;

  private constructor() {
    functions.logger.debug('Initializing new Conversation Handler');
    this.app = conversation();
    this.registerHandlers();
  }

  public static get Instance() {
    if (!this._instance) this._instance = new this();
    return this._instance.app;
  }

  private registerHandlers() {
    this.app.handle(HandlerNames.Main, MainHandler);
    this.app.handle(HandlerNames.ReadSingleParameter, ReadSingleParamHandler);
  }
}
