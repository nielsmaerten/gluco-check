import {ConversationV3} from '@assistant/conversation';
import DiabetesQuery from '../../types/DiabetesQuery';
import {injectable} from 'inversify';
import {DiabetesPointer} from '../../types/DiabetesPointer';
import AuthTokenDecoder from './AuthTokenDecoder';
import UserProfileClient from '../clients/UserProfileClient';
import {logger, config} from 'firebase-functions';
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
      user.defaultPointers = [DiabetesPointer.BloodSugar]; // FIXME(architecture): this seems illogical?
    }

    // Build DiabetesQuery object with all info required to respond to the user
    const diabetesPointers = await this.extractPointers(conv, user);
    const diabetesQuery = new DiabetesQuery(user, locale, diabetesPointers);
    if (user.exists) {
      logger.debug('[ConversationDecoder]: Processing query:', diabetesQuery);
    }
    logger.info(
      `[ConversationDecoder]: ${user.userId.substr(0, 4)}...`,
      `requested: ${diabetesQuery.pointers}`
    );

    diabetesQuery.metadata.mentionDisclaimer = this.shouldMentionDisclaimer(conv, user);
    return diabetesQuery;
  }

  /**
   * Disclaimer should be added to the response if:
   * - GlucoCheck was invoked using the latest version of the Action
   * - OR: The user settings specify the disclaimer should be said
   */
  shouldMentionDisclaimer(conv: ConversationV3, user: User): boolean {
    const raw_version_currentAction = conv.headers['gluco-check-version'];
    const raw_version_lastKnown = config().google_actions_sdk.glucocheck_action_version;

    const version_currentAction = parseInt(raw_version_currentAction as string);
    const version_lastKnown = parseInt(raw_version_lastKnown);

    if (!version_lastKnown) {
      const errMsg =
        'Before using this webhook, ' +
        '[google_actions_sdk.glucocheck_action_version] must be set' +
        'using the command: firebase functions:config:set';
      logger.error(errMsg);
      throw new Error(errMsg);
    }
    const usingNewerAction = version_currentAction > version_lastKnown;
    return user.mentionDisclaimer || usingNewerAction;
  }

  /**
   * Extracts which DiabetesPointers were asked for in the conversation
   */
  async extractPointers(conv: ConversationV3, user: User): Promise<DiabetesPointer[]> {
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
