import GlucoCheckCore from 'gluco-check-core';
import * as functions from 'firebase-functions';
import {
  conversation,
  ConversationV3App,
  ConversationV3,
  OmniHandler,
} from '@assistant/conversation';
const logTag = '[Webhook.ConversationHandler]';

// Names of intents that can be received from the Action
enum IntentHandlers {
  DefaultMetrics = 'default_metrics',
  CustomMetrics = 'custom_metrics',
}

export default class ConversationHandler {
  // Singleton setup
  private static _instance: ConversationHandler;
  public static get Instance() {
    if (!this._instance) this._instance = new this();
    return this._instance.app;
  }

  // Actions SDK Setup
  private app: OmniHandler & ConversationV3App<ConversationV3>;
  private constructor() {
    functions.logger.debug(logTag, 'Initializing');
    this.app = conversation();
    this.registerHandlers();
  }

  // Global Handler just sends all intents to the CORE package
  private globalHandler = async (conversation: ConversationV3) => {
    return GlucoCheckCore.handler(conversation);
  };

  // Bind all intents to the Global Handler
  private registerHandlers() {
    this.app.handle(IntentHandlers.DefaultMetrics, this.globalHandler);
    this.app.handle(IntentHandlers.CustomMetrics, this.globalHandler);
  }
}
