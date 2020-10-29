import {DiabetesPointer} from './DiabetesPointer';
import User from './User';

/**
 * A DiabetesQuery represents a request for information (query) that the user has asked of Gluco Check.
 *
 * For example:
 *
 * The expression "Hey Google, ask Gluco Check what my IOB is"
 * could be expressed as the following DiabetesQuery:
 * {userId: "email@domain.com", locale: "en-US", pointers: [DiabetesPointer.IOB]}
 */
export default class DiabetesQuery {
  // Basic data needed to fulfill the query
  public user: User;
  public locale: string;
  public pointers: DiabetesPointer[];

  // Metadata to format the AssistantResponse
  // TODO: this doesn't belong here!
  public metadata = {
    mentionHealthDisclaimer: true,
    mentionMissingPointers: true,
  };

  constructor(user: User, locale: string, pointers: DiabetesPointer[]) {
    this.user = user;
    this.locale = locale;
    this.pointers = pointers;

    // Did user explicitly ask for 'Everything'?
    const userAskedEverything = pointers.includes(DiabetesPointer.Everything);

    if (userAskedEverything) {
      // When asking all pointers, unavailable pointers shouldn't be mentioned
      // https://github.com/nielsmaerten/gluco-check/issues/20#issuecomment-711417430
      this.metadata.mentionMissingPointers = false;

      // Expand the 'Everything' pointer
      const everyPointer = Object.values(DiabetesPointer);
      this.pointers = everyPointer.filter(p => p !== DiabetesPointer.Everything);
    }
  }
}
