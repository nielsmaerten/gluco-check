import {ConversationV3} from '@assistant/conversation';
import UserQueryResolver from './main/UserQueryResolver';
import ConversationDecoder from './main/ConversationDecoder';
import { injectable } from 'inversify';
import container from './inversify.config';

@injectable()
export class GlucoCheckCore {
  constructor(
    private ConversationDecoder: ConversationDecoder,
    private UserQueryResolver: UserQueryResolver
  ) {}

  handleAssistantConversation(conversation: ConversationV3) {
    const userQuery = this.ConversationDecoder.decode(conversation);
    const userQueryResponse = this.UserQueryResolver.resolve(userQuery);

    conversation.add(userQueryResponse.SSML);
  }
}

export default container.get(GlucoCheckCore);
