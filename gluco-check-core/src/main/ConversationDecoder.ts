import {ConversationV3} from '@assistant/conversation';
import DiabetesQuery from '../types/DiabetesQuery';
import {injectable} from 'inversify';
import {DiabetesPointer} from '../types/DiabetesPointer';
import AuthTokenDecoder from './AuthTokenDecoder';
import {logger} from 'firebase-functions';

@injectable()
/**
 * The ConversationDecoder figures out what the user actually asked for.
 * It takes in a 'conversation' object from Google Actions, and decodes it into a DiabetesQuery
 */
export default class ConversationDecoder {
  constructor(private authTokenDecoder: AuthTokenDecoder) {}

  async decode(conversation: ConversationV3): Promise<DiabetesQuery> {
    // Populate conversation.user with info from json web token
    await this.authTokenDecoder.decodeGoogleUserToken(conversation);

    // The following info needs to be extracted from the Conversation:
    const locale = conversation.user.locale;
    const userId = conversation.user.params.tokenPayload.email;
    const pointers = getDiabetesPointers(conversation);

    // Build DiabetesQuery object with all info required to respond to the user
    const diabetesQuery = new DiabetesQuery(userId, locale, pointers);
    logger.info('Processing diabetes query:', diabetesQuery);

    return diabetesQuery;
  }
}

function getDiabetesPointers(conversation: ConversationV3): DiabetesPointer[] {
  const intentParams = conversation.intent.params || {};

  if (conversation.handler.name === 'default_pointers') {
    // TODO: Get default parameters for this user
    return [DiabetesPointer.BloodSugar];
  }

  return intentParams.diabetesPointer.resolved;
}
