import {ConversationV3} from '@assistant/conversation';

module.exports = {
  decodeGoogleUserToken: async (conversation: ConversationV3) => {
    Object.assign(conversation.user, {
      params: {
        tokenPayload: {
          email: 'test@example.com',
        },
      },
    });
  },
};
