import ConversationDecoder from './ConversationDecoder';
import DiabetesQueryResolver from './DiabetesQueryResolver';

import {injectable} from 'inversify';
import {ConversationV3} from '@assistant/conversation';

@injectable()
/**
 * Main entry point of the package gluco-check-core:
 * Exposes a single method 'handler' which should be passed to
 * Google Assistant apps
 */
export default class GlucoCheckCore {
  constructor(
    private conversationDecoder: ConversationDecoder,
    private queryResolver: DiabetesQueryResolver
  ) {}

  /**
   * Pass this method to the 'handle' function of an @assistant/conversation
   */
  async handler(conversation: ConversationV3) {
    const diabetesQuery = await this.conversationDecoder.decode(conversation);
    const assistantResponse = await this.queryResolver.resolve(diabetesQuery);
    conversation.add(assistantResponse.SSML);
  }
}
