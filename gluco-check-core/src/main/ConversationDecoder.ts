import {ConversationV3} from '@assistant/conversation';
import DiabetesQuery from '../types/DiabetesQuery';
import {injectable} from 'inversify';
import {DiabetesPointer} from '../types/DiabetesPointer';
import {IntentParameterValue} from '@assistant/conversation/dist/api/schema';

@injectable()
/**
 * The ConversationDecoder figures out what the user actually asked for.
 * It takes in a 'conversation' object from Google Actions, and decodes it into a DiabetesQuery
 */
export default class ConversationDecoder {
  decode(conversation: ConversationV3): DiabetesQuery {
    // The following info needs to be extracted from the Conversation:
    const locale = conversation.user.locale;
    const userId = 'TODO'; // TODO
    const pointers = getDiabetesPointers(conversation);

    return new DiabetesQuery(userId, locale, pointers);
  }
}

function getDiabetesPointers(conversation: ConversationV3): DiabetesPointer[] {
  const intentParams = conversation.intent.params || {};

  if (!intentParams['diabetesPointer']) {
    throw `Intent '${conversation.intent.name}' did not specify a diabetesPointer. 
    Currently, only intents specifying this param can be handled.`;
  }

  return intentParams.diabetesPointer.resolved;
}