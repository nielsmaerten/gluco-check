/* istanbul ignore file: External system (Google Actions) */
import {ConversationV3} from '@assistant/conversation';
import {AuthHeaderProcessor} from '@assistant/conversation/dist/auth';
import {logger, config} from 'firebase-functions';
import {injectable} from 'inversify';
const logTag = '[AuthTokenDecoder]';

@injectable()
/**
 * Decodes the Authorization header of a request coming from Google Assistant
 * into a JWT with all user properties and adds this to the conversation object
 */
export default class AuthTokenDecoder {
  private clientId: string;
  private authHeaderProcessor = new AuthHeaderProcessor();

  constructor() {
    logger.debug(logTag, 'Initializing');
    this.clientId = config().google_actions_sdk.client_id;

    if (!this.clientId)
      throw new Error(
        `${logTag} Firebase Functions config must define client_id property`
      );
  }

  async decodeGoogleUserToken(conversation: ConversationV3) {
    const header = '' + conversation.headers.authorization;
    const processor = this.authHeaderProcessor;
    const clientId = this.clientId;

    await conversation.user.processAuthHeader(header, processor, clientId);
  }
}
