import {UserParameter} from './UserParameter';

/**
 * TODO: Refine/Remove/Evaluate this type definition
 * When a user asks the app something, their request is represented by this object.
 * It needs to be passed through an ApiHandler to produce a UserSnapshot
 */
export default class UserQuery {
  requestedParameters: UserParameter[];
  userId: string;

  constructor(requestedParameters: UserParameter[], userId: string) {
    this.requestedParameters = requestedParameters;
    this.userId = userId;
  }
}
