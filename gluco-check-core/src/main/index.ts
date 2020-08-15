import ConversationDecoder from './ConversationDecoder';
import UserQueryResolver from './UserQueryResolver';

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
    private ConversationDecoder: ConversationDecoder,
    private UserQueryResolver: UserQueryResolver
  ) {}

  /**
   * Pass this method to the 'handle' function of an @assistant/conversation
   */
  handler(conversation: ConversationV3) {
    const userQuery = this.ConversationDecoder.decode(conversation);
    const userQueryResponse = this.UserQueryResolver.resolve(userQuery);

    conversation.add(userQueryResponse.SSML);
  }
}
