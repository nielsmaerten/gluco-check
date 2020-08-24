import {ConversationV3} from '@assistant/conversation';
import {AuthHeaderProcessor} from '@assistant/conversation/dist/auth';
import {logger, config} from 'firebase-functions';
import {injectable} from 'inversify';

@injectable()
export default class AuthTokenDecoder {
  private clientId: string;
  private authHeaderProcessor = new AuthHeaderProcessor();

  constructor() {
    logger.debug('Initializing new AuthTokenDecoder');
    this.clientId = config().auth.client_id;

    if (!this.clientId)
      throw 'Firebase Functions config must define an auth.client_id property';
  }

  async decodeGoogleUserToken(conversation: ConversationV3) {
    const header = '' + conversation.headers.authorization;
    const processor = this.authHeaderProcessor;
    const clientId = this.clientId;

    await conversation.user.processAuthHeader(header, processor, clientId);
  }
}
