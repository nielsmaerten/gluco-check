import {DmMetric} from './DmMetric';
import User from './User';

/**
 * A DmQuery represents a request for information (query) that the user has asked of Gluco Check.
 *
 * For example:
 *
 * The expression "Hey Google, ask Gluco Check what my IOB is"
 * could be expressed as the following DmQuery:
 * {user: "email@domain.com", locale: "en-US", metrics: [DmMetric.IOB]}
 */
export default class DmQuery {
  // Basic data needed to fulfill the query
  public user: User;
  public locale: string;
  public metrics: DmMetric[];

  // Extra info that decides how we should respond to the query
  public metadata = {
    mentionDisclaimer: true,
    mentionMissingMetrics: true,
    invocation: '',
  };

  constructor(user: User, locale: string, metrics: DmMetric[]) {
    this.user = user;
    this.locale = locale;
    this.metrics = metrics;

    // Did user explicitly ask for 'Everything'?
    const userAskedEverything = metrics.includes(DmMetric.Everything);

    if (userAskedEverything) {
      // Expand the 'Everything' metric
      const everyMetric = Object.values(DmMetric);
      this.metrics = everyMetric.filter(p => p !== DmMetric.Everything);
    }
  }
}
