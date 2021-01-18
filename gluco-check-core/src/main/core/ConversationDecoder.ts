import {ConversationV3} from '@assistant/conversation';
import DmQuery from '../../types/DmQuery';
import {injectable} from 'inversify';
import {DmMetric} from '../../types/DmMetric';
import AuthTokenDecoder from './AuthTokenDecoder';
import UserProfileClient from '../clients/UserProfileClient';
import {logger, config} from 'firebase-functions';
import User from '../../types/User';
const logTag = '[ConversationDecoder]';

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
    const censoredUserId = `${user.userId.substr(0, 7)}***`;

    // Build DmQuery object with all info required to respond to the user
    const dmMetrics = await this.extractMetrics(conv, user);
    const dmQuery = new DmQuery(user, locale, dmMetrics);
    dmQuery.metadata = {
      invocation: conv.intent.query || '',
      mentionDisclaimer: this.shouldMentionDisclaimer(conv, user),
      mentionMissingMetrics: this.shouldMentionMissingMetrics(conv, dmMetrics),
    };

    // Log status
    logger.info(`${logTag} ${censoredUserId} said: '${dmQuery.metadata.invocation}'`);
    if (!user.exists) {
      logger.warn(
        `${logTag} '${censoredUserId}' invoked Gluco Check but does not exist in db`
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
      logger.info(logTag, 'Force mentioning disclaimer bc of newer Action calling');
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
      const errMsg = `${logTag} Initialization failed: glucocheck_action_version must be set`;
      logger.error(errMsg);
      throw new Error(errMsg);
    } else {
      logger.debug(`${logTag} Assuming latest version of the Action is v${version}`);
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

  /**
   * Missing metrics are only mentioned if the user explicitly asked for them
   * https://github.com/nielsmaerten/gluco-check/issues/20#issuecomment-711417430
   */
  private shouldMentionMissingMetrics(conv: ConversationV3, metrics: DmMetric[]) {
    const userAskedEverything = metrics.includes(DmMetric.Everything);
    const isDeepInvocation = this.isDeepInvocation(conv);
    return isDeepInvocation && !userAskedEverything;
  }

  private isDeepInvocation(conv: ConversationV3) {
    return conv.handler.name === 'custom_metrics';
  }
}
