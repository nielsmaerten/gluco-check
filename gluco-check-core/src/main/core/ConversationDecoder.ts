import {ConversationV3} from '@assistant/conversation';
import DiabetesQuery from '../../types/DiabetesQuery';
import {injectable} from 'inversify';
import {DiabetesPointer} from '../../types/DiabetesPointer';
import AuthTokenDecoder from './AuthTokenDecoder';
import UserProfileClient from '../clients/UserProfileClient';
import {logger} from 'firebase-functions';
import User from '../../types/User';

@injectable()
/**
 * The ConversationDecoder figures out what the user actually asked for.
 * It takes in a 'conversation' object from Google Actions, and decodes it into a DiabetesQuery
 */
export default class ConversationDecoder {
  constructor(
    private authTokenDecoder: AuthTokenDecoder,
    private userProfileClient: UserProfileClient
  ) {}

  /**
   * Interprets an Assistant Conversation object and returns a DiabetesQuery
   * representing what the user asked for
   */
  async decode(conv: ConversationV3): Promise<DiabetesQuery> {
    // Populate conversation.user with info from json web token
    await this.authTokenDecoder.decodeGoogleUserToken(conv);

    // The following info needs to be extracted from the Conversation:
    const locale = conv.user.locale;
    const userId = conv.user.params.tokenPayload.email;
    const user = await this.userProfileClient.getUser(userId);

    if (!user.exists) {
      logger.warn(
        `[ConversationDecoder]: '${userId}'`,
        'invoked Gluco Check but does not exist in db'
      );
      user.defaultPointers = [DiabetesPointer.BloodSugar];
    }

    // Build DiabetesQuery object with all info required to respond to the user
    const diabetesPointers = await this.getPointers(conv, user);
    const diabetesQuery = new DiabetesQuery(user, locale, diabetesPointers);
    if (user.exists) {
      logger.debug('[ConversationDecoder]: Processing query:', diabetesQuery);
    }
    logger.info(
      `[ConversationDecoder]: ${user.userId.substr(0, 4)}...`,
      `requested: ${diabetesQuery.pointers}`
    );

    return diabetesQuery;
  }

  /**
   * Extracts which DiabetesPointers were asked for in the conversation
   */
  async getPointers(conv: ConversationV3, user: User): Promise<DiabetesPointer[]> {
    const isDeepInvocation = conv.handler.name === 'custom_pointers';

    if (isDeepInvocation) {
      // Get requested pointers from intent params
      return conv.intent.params!.diabetesPointer!.resolved;
    } else {
      // Get requested pointers from user profile
      return user.defaultPointers!;
    }
  }
}
