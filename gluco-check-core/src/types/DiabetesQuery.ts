import {DiabetesPointer} from './DiabetesPointer';

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
    public userId: string,
    public locale: string,
    public pointers: DiabetesPointer[]
  ) {}
}
