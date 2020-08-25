import User from '../../../src/types/User';
import {DiabetesPointer} from '../../../src/types/DiabetesPointer';

export default class UserProfileClient {
  constructor(private userExists: boolean = true) {}

  getUser(): User {
    return {
      userId: 'test@example.com',
      exists: this.userExists,
      defaultPointers: [DiabetesPointer.BloodSugar],
    };
  }
}
