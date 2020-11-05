import {DiabetesPointer} from '../../src/types/DiabetesPointer';

export default class UserProfileClient {
  constructor(private userExists = true) {}

  getUser() {
    return {
      exists: this.userExists,
      userId: 'test@example.com',
      defaultPointers: this.userExists ? [DiabetesPointer.BloodSugar] : undefined,
    };
  }
}
