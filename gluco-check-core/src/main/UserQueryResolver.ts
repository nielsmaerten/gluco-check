import UserQuery from '../types/UserQuery';
import UserQueryResponse from '../types/UserQueryResponse';
import {injectable} from 'inversify';

@injectable()
export default class UserQueryResolver {
  resolve(userQuery: UserQuery): UserQueryResponse {
    // TODO
    console.log('Not implemented.');
    return {
      SSML: '',
      locale: 'en-us',
      timestamp: 0,
    };
  }
}
