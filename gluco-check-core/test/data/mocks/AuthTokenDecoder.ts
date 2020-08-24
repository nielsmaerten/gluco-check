import {ConversationV3} from '@assistant/conversation';

export default class {
  decodeGoogleUserToken(conversation: ConversationV3) {
    Object.assign(conversation.user, {
      params: {
        tokenPayload: {
          email: 'test@example.com',
        },
      },
    });
  }
}
