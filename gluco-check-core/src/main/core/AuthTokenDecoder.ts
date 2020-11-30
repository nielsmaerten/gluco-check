/* istanbul ignore file: External system (Google Actions) */
import {ConversationV3} from '@assistant/conversation';
import {AuthHeaderProcessor} from '@assistant/conversation/dist/auth';
import {logger, config} from 'firebase-functions';
import {injectable} from 'inversify';

@injectable()
/**
 * Decodes the Authorization header of a request coming from Google Assistant
 * into a JWT with all user properties and adds this to the conversation object
 */
export default class AuthTokenDecoder {
  private clientId: string;
  private authHeaderProcessor = new AuthHeaderProcessor();

  constructor() {
    logger.debug('[AuthTokenDecoder]: Initializing new instance');
    this.clientId = config().google_actions_sdk.client_id;

    if (!this.clientId)
      throw '[AuthTokenDecoder]: Firebase Functions config must define an auth.client_id property';
  }

  async decodeGoogleUserToken(conversation: ConversationV3) {
    const header = '' + conversation.headers.authorization;
    const processor = this.authHeaderProcessor;
    const clientId = this.clientId;

    await conversation.user.processAuthHeader(header, processor, clientId);
  }
}
