import {DmMetric} from '../../src/types/DmMetric';

export default class UserProfileClient {
  constructor(private userExists = true) {}

  getUser() {
    return {
      exists: this.userExists,
      userId: 'test@example.com',
      defaultPointers: this.userExists ? [DmMetric.BloodSugar] : undefined,
    };
  }
}
