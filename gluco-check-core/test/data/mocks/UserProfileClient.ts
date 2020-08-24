import User from '../../../src/types/User';
import {DiabetesPointer} from '../../../src/types/DiabetesPointer';

export default class UserProfileClient {
  getUser(): User {
    return {
      userId: 'test@example.com',
      exists: true,
      defaultPointers: [DiabetesPointer.BloodSugar],
    };
  }
}
