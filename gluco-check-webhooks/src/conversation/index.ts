import {
  conversation,
  ConversationV3App,
  ConversationV3,
  OmniHandler,
} from '@assistant/conversation';
import * as functions from 'firebase-functions';

import GlucoCheckCore from 'gluco-check-core';

enum HandlerNames {
  DefaultPointers = 'default_pointers',
  CustomPointers = 'custom_pointers',
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
    this.app.handle(HandlerNames.DefaultPointers, conversation =>
      GlucoCheckCore.handler(conversation)
    );
    this.app.handle(HandlerNames.CustomPointers, conversation =>
      GlucoCheckCore.handler(conversation)
    );
  }
}
