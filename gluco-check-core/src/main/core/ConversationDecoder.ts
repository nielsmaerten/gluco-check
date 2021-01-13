import {ConversationV3} from '@assistant/conversation';
import DmQuery from '../../types/DmQuery';
import {injectable} from 'inversify';
import {DmMetric} from '../../types/DmMetric';
import AuthTokenDecoder from './AuthTokenDecoder';
import UserProfileClient from '../clients/UserProfileClient';
import {logger, config} from 'firebase-functions';
import User from '../../types/User';

@injectable()
/**
 * The ConversationDecoder figures out what the user actually asked for.
 * It takes in a 'conversation' object from Google Actions, and decodes it into a DmQuery
 */
export default class ConversationDecoder {
  private lastKnownActionVersion: number;

  constructor(
    private authTokenDecoder: AuthTokenDecoder,
    private userProfileClient: UserProfileClient
  ) {
    this.lastKnownActionVersion = this.getLastKnownActionVersion();
  }

  /**
   * Interprets an Assistant Conversation object and returns a DmQuery
   * representing what the user asked for
   */
  async decode(conv: ConversationV3): Promise<DmQuery> {
    // Populate conversation.user with info from json web token
    await this.authTokenDecoder.decodeGoogleUserToken(conv);

    // The following info needs to be extracted from the Conversation:
    const locale = conv.user.locale;
    const userId = conv.user.params.tokenPayload.email;
    const user = await this.userProfileClient.getUser(userId);

    // Build DmQuery object with all info required to respond to the user
    const dmMetrics = await this.extractMetrics(conv, user);
    const dmQuery = new DmQuery(user, locale, dmMetrics);
    dmQuery.metadata.mentionDisclaimer = this.shouldMentionDisclaimer(conv, user);
    dmQuery.metadata.mentionMissingMetrics = this.isDeepInvocation(conv);

    // Log status
    logger.info(
      `[ConversationDecoder]: ${user.userId.substr(0, 7)}...`,
      `requested: ${dmQuery.metrics}`
    );
    if (user.exists) {
      logger.debug('[ConversationDecoder]: Processing query:', dmQuery);
    } else {
      logger.warn(
        `[ConversationDecoder]: '${userId}'`,
        'invoked Gluco Check but does not exist in db'
      );
    }
    return dmQuery;
  }

  /**
   * Disclaimer should be added to the response if:
   * - The user has not already heard it
   * - OR: Invoked using a newer version of the Action
   */
  private shouldMentionDisclaimer(conv: ConversationV3, user: User): boolean {
    // User hasn't heard disclaimer before
    if (!user.heardDisclaimer) return true;

    // Invoked using latest version of the Action
    const invokingActionVersion_raw = conv.headers['gluco-check-version'];
    const invokingActionVersion = parseInt(invokingActionVersion_raw as string);

    const usingNewerAction = invokingActionVersion > this.lastKnownActionVersion;
    if (usingNewerAction) {
      logger.info('Force mentioning disclaimer bc of newer Action calling');
    }
    return usingNewerAction;
  }

  /**
   * The last known version of the Google Action, is pulled from Firebase Config
   * You must set this value using the Firebase CLI before deploying
   *
   * Disclaimers will always be mentioned in the last known version
   */
  private getLastKnownActionVersion() {
    const versionString = config().google_actions_sdk.glucocheck_action_version;
    const version = parseInt(versionString);

    // Abort if the Action version has not been set
    if (!version) {
      const errMsg =
        '[ConversationDecoder]: Initialization failed: glucocheck_action_version must be set';
      logger.error(errMsg);
      throw new Error(errMsg);
    } else {
      logger.debug(
        '[ConversationDecoder]: Assuming',
        `v${version}`,
        'is the latest version of the Gluco Check Action being used.'
      );
      return version;
    }
  }

  /**
   * Extracts which DmMetrics were asked for in the conversation
   */
  private async extractMetrics(conv: ConversationV3, user: User): Promise<DmMetric[]> {
    const isDeepInvocation = this.isDeepInvocation(conv);
    const hasDmMetrics = conv.intent.params?.DmMetric !== undefined;

    if (isDeepInvocation && hasDmMetrics) {
      // Get requested metrics from intent params
      return conv.intent.params!.DmMetric!.resolved;
    } else {
      // Get requested metrics from user profile
      return user.defaultMetrics ?? [];
    }
  }

  private isDeepInvocation(conv: ConversationV3) {
    return conv.handler.name === 'custom_metrics';
  }
}
