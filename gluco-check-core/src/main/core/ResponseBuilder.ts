import {injectable} from 'inversify';

import InternationalizationHelper from '../i18n';
import DmSnapshot from '../../types/DmSnapshot';
import AssistantResponse from '../../types/AssistantResponse';

import {ErrorType} from '../../types/ErrorType';
import {DmMetric} from '../../types/DmMetric';
import Humanizer from '../i18n/humanizers';
import DmQuery from '../../types/DmQuery';
import UserProfileClient from '../clients/UserProfileClient';

@injectable()
export default class ResponseBuilder {
  constructor(
    private localizer: InternationalizationHelper,
    private userClient: UserProfileClient
  ) {}

  async build(snapshot: DmSnapshot): Promise<AssistantResponse> {
    // Ensure the required locale is available
    await this.localizer.ensureLocale(snapshot.query.locale);

    // Handle general errors, if any
    const generalError = findGeneralErrors(snapshot);
    if (generalError) return this.errorResponse(snapshot, generalError);
    // Build a normal response
    else return this.normalResponse(snapshot);
  }

  private async normalResponse(snapshot: DmSnapshot): Promise<AssistantResponse> {
    // Humanize every metric in the Snapshot
    const metrics: string[] = await Humanizer.dmSnapshot(snapshot);
    const response = metrics.join(' ');

    // If the response will include a disclaimer, flag disclaimer as heard
    const disclaimer = medicalDisclaimer(snapshot.query);
    if (disclaimer) {
      const user = snapshot.query.user;
      await this.userClient.flagDisclaimerAsHeard(user, false);
    }

    // Construct response SSML
    const SSML = `<speak><s>${response}</s> <s>${disclaimer}</s></speak>`;
    return new AssistantResponse(SSML, snapshot.query.locale);
  }

  private errorResponse(
    snapshot: DmSnapshot,
    error: {type: ErrorType; affectedMetric: DmMetric}
  ) {
    const response = Humanizer.error(error.type, snapshot.query.locale);
    const disclaimer = medicalDisclaimer(snapshot.query);

    // Construct response SSML
    const SSML = `<speak><s>${response}</s> <s>${disclaimer}</s></speak>`;
    return new AssistantResponse(SSML, snapshot.query.locale);
  }
}
/**
 * General errors are situations that cause the entire query to fail.
 * None of the requested metrics will be resolved.
 */
function findGeneralErrors(snapshot: DmSnapshot) {
  const generalErrors = [
    ErrorType.Nightscout_Unauthorized,
    ErrorType.Nightscout_Unavailable,
    ErrorType.Firebase_UserNotFound,
  ];
  return snapshot.errors.find(e => generalErrors.includes(e.type));
}

function medicalDisclaimer(query: DmQuery) {
  if (!query.metadata.mentionDisclaimer) {
    return '';
  } else {
    return Humanizer.disclaimer(query.locale);
  }
}
