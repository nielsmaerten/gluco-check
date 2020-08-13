import {ConversationV3} from '@assistant/conversation';
import UserQuery from '../types/UserQuery';

export default class ConversationDecoder {
  decode(conversation: ConversationV3): UserQuery {
    // TODO
    console.log('Not implemented.');
    return {
      requestedParameters: [],
      userId: '',
    };
  }
}
