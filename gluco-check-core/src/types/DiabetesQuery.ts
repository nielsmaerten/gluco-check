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
  constructor(
    public user: User,
    public locale: string,
    public pointers: DiabetesPointer[],
  ) {
    if (pointers.includes(DiabetesPointer.Everything)) {
      // expand to all available pointers
      const allPointers = Object.values(DiabetesPointer);
      this.pointers = allPointers.filter(v => v !== DiabetesPointer.Everything);
    }
  }
}
