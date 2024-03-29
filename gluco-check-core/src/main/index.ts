import ConversationDecoder from './core/ConversationDecoder';
import QueryResolver from './core/QueryResolver';
import ResponseBuilder from './core/ResponseBuilder';

import {injectable} from 'inversify';
import {ConversationV3} from '@assistant/conversation';
import NightscoutProps from '../types/NightscoutProps';
import NightscoutClient from './clients/nightscout/NightscoutClient';

@injectable()
export default class GlucoCheckCore {
  constructor(
    private conversationDecoder: ConversationDecoder,
    private queryResolver: QueryResolver,
    private responseBuilder: ResponseBuilder
  ) {}

  /**
   * The handler method is the core library's main entry point.
   * It's what the Google Actions SDK will invoke to handle any incoming conversations.
   * Actions SDK is initialized by the webhook package
   */
  async handler(conversation: ConversationV3) {
    // Find out which metrics the user has requested
    const query = await this.conversationDecoder.decode(conversation);

    // Query the requested metrics
    const snapshot = await this.queryResolver.buildSnapshot(query);

    // Build a response
    const response = await this.responseBuilder.build(snapshot);

    // Have the assistant say the response back
    conversation.add(response.SSML);
  }

  /**
   * Checks if GlucoCheck can read data from a provided Nightscout site
   * @param props Object containing a url and token for a Nightscout site
   */
  async validate(props: {url: string; token: string}) {
    const nightscoutProps = new NightscoutProps(props.url, props.token);
    const nightscoutClient = new NightscoutClient(nightscoutProps);
    return nightscoutClient.validate();
  }
}
