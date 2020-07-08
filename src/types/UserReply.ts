/**
 * TODO: Refine/Remove/Evaluate this type definition
 * A UserReply is something that can be said back by Google Assistant in response to a question
 */
export default class UserReply {
  speechSynthesisMarkupLanguage!: string;
  timestamp!: number;
  locale!: string;

  constructor(params: UserReply) {
    Object.assign(this, params);
  }
}
