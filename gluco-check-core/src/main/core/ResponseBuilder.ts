import {injectable} from 'inversify';

import InternationalizationHelper from '../i18n';
import DmSnapshot from '../../types/DmSnapshot';
import AssistantResponse from '../../types/AssistantResponse';

import {ErrorType} from '../../types/ErrorType';
import {DmMetric} from '../../types/DmMetric';
import Humanizer from '../i18n/humanizers';

@injectable()
export default class ResponseBuilder {
  constructor(private localizer: InternationalizationHelper) {}

  async build(snapshot: DmSnapshot): Promise<AssistantResponse> {
    // Ensure the required locale is available
    await this.localizer.ensureLocale(snapshot.query.locale);

    // Handle general errors, if any
    const generalError = findGeneralErrors(snapshot);
    if (generalError) return errorResponse(snapshot, generalError);
    // Build a normal response
    else return normalResponse(snapshot);
  }
}

async function normalResponse(snapshot: DmSnapshot): Promise<AssistantResponse> {
  // Humanize every metric in the Snapshot
  const humanizedMetrics: string[] = await Humanizer.snapshot(snapshot);

  // Wrap every humanized string in an <s>-tag
  // Note the space at the end for readability --------▽
  const s_tags = humanizedMetrics.map(txt => `<s>${txt} </s>`);

  // Join all tags together to create the SSML string
  const output = s_tags.join('');
  const SSML = `<speak>${output}</speak>`;

  return new AssistantResponse(SSML, snapshot.query.locale);
}

function errorResponse(
  snapshot: DmSnapshot,
  error: {type: ErrorType; affectedMetric: DmMetric}
) {
  const errorTxt = Humanizer.error(error.type, snapshot.query.locale);
  const SSML = `<speak>${errorTxt}</speak>`;
  return new AssistantResponse(SSML, snapshot.query.locale);
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
