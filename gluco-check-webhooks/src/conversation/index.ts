import {
  conversation,
  ConversationV3App,
  ConversationV3,
  OmniHandler,
} from '@assistant/conversation';
import * as functions from 'firebase-functions';

import GlucoCheckCore from 'gluco-check-core';

enum HandlerNames {
  DefaultMetrics = 'default_metrics',
  CustomMetrics = 'custom_metrics',
}

export default class ConversationHandler {
  private static _instance: ConversationHandler;
  private app: OmniHandler & ConversationV3App<ConversationV3>;

  private constructor() {
    functions.logger.debug('[Webhook]: Initializing new ConversationHandler');
    this.app = conversation();
    this.registerHandlers();
  }

  public static get Instance() {
    if (!this._instance) this._instance = new this();
    return this._instance.app;
  }

  private registerHandlers() {
    const globalHandler = async (conversation: ConversationV3) => {
      return GlucoCheckCore.handler(conversation);
    };
    this.app.handle(HandlerNames.DefaultMetrics, globalHandler);
    this.app.handle(HandlerNames.CustomMetrics, globalHandler);
  }
}
