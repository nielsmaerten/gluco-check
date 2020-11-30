import DmQuery from '../../types/DmQuery';
import {ErrorType} from '../../types/ErrorType';
import DmSnapshot from '../../types/DmSnapshot';
import NightscoutClient from '../clients/nightscout/NightscoutClient';
import {injectable} from 'inversify';
import {logger} from 'firebase-functions';
import {performance} from 'perf_hooks';
import {DmMetric} from '../../types/DmMetric';

@injectable()
export default class QueryResolver {
  /**
   * Resolves a DmQuery by fetching all requested metrics from Nightscout.
   * Returns a DmSnapshot with all of the fetched values
   */
  async buildSnapshot(query: DmQuery): Promise<DmSnapshot> {
    // Ensure user exists and has a Nightscout Site
    if (!query.user.exists || !query.user.nightscout) {
      return this.userNotFoundError(query);
    }

    // Create an empty snapshot. We'll add requested Metrics in here
    const newSnapshot = new DmSnapshot({
      query: query,
      timestamp: Date.now(),
      glucoseUnit: query.user.glucoseUnit,
    });

    // Create a Nightscout Client we can use for querying
    const nsClient = new NightscoutClient(query.user.nightscout);

    // Query Nightscout for each requested metric
    const queryStart = performance.now();
    const promises = query.metrics.map(p => nsClient.getMetric(p) as Partial<DmSnapshot>);
    const partialSnapshots = await Promise.all(promises);
    const totalQueryTime = Math.floor(performance.now() - queryStart);
    logger.info(`[DiabetesQueryResolver]: Nightscout queries took ${totalQueryTime} ms.`);

    // Add all partial snapshots into the main snapshot
    newSnapshot.update(...partialSnapshots);
    return newSnapshot;
  }

  private userNotFoundError(query: DmQuery) {
    return new DmSnapshot({
      timestamp: Date.now(),
      query,
      errors: [
        {
          type: ErrorType.Firebase_UserNotFound,
          affectedMetric: DmMetric.Everything,
        },
      ],
    });
  }
}
