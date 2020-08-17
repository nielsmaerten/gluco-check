/**
 * An AssistantResponse is something the Google Assistant
 * can say back in response to something the user said.
 *
 * For example: When the user says: "Hey Google, ask gluco check about my glucose",
 * the Assistant could respond with "120 and stable as of 4 minutes ago".
 *
 * This response can be represented by the following AssistantResponse:
 * {SSML: "120 and stable...", timestamp: 1233556, locale: "en-US"}
 */
export default class AssistantResponse {
  constructor(public SSML: string, public timestamp: number, public locale: string) {}
}
