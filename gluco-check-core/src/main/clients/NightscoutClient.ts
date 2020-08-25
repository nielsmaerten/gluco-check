import User from '../../types/User';
import DiabetesSnapshot from '../../types/DiabetesSnapshot';

export default abstract class NightscoutClient {
  public static getSnapshot(user: User): DiabetesSnapshot {
    // TODO next
    return new DiabetesSnapshot({
      timestamp: Date.now(),
    });
  }
}
