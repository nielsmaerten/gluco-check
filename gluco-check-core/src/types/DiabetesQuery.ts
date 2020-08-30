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
    public pointers: DiabetesPointer[]
  ) {
    // The pointer 'Everything' should be expanded to all available pointers
    if (pointers.includes(DiabetesPointer.Everything)) {
      const allPointers = Object.values(DiabetesPointer);
      this.pointers = allPointers.filter(v => v !== DiabetesPointer.Everything);
    }
  }
}
