/**
 * An AssistantResponse is something the Google Assistant
 * can say back in response to a question from the user.
 *
 * For example: When the user says: "Hey Google, ask gluco check about my glucose",
 * the Assistant could respond with "120 and stable as of 4 minutes ago".
 */
export default class AssistantResponse {
  /**
   * @param SSML https://en.wikipedia.org/wiki/Speech_Synthesis_Markup_Language
   * @param locale The locale used in this response
   */
  constructor(public SSML: string, public locale: string) {}
}
