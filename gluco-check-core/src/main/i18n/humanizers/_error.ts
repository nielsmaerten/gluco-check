import {i18next} from '..';
import {ErrorType} from '../../../types/ErrorType';
import {DmMetric} from '../../../types/DmMetric';
import FormatParams from '../../../types/FormatParams';
import {gc_url} from '../../constants';
import {logger} from 'firebase-functions';
const logTag = '[Humanizer]';

export default function humanizeError(
  errorType: ErrorType,
  locale: string,
  affectedMetric?: DmMetric
): string {
  // Collect translation context
  const context = {
    metric: i18next.getFixedT(locale)('common.metrics.' + affectedMetric),
    gc_url,
  };

  // Build translation key
  const key = `assistant_responses.errors.${errorType}`;

  // Return localized string
  return i18next.getFixedT(locale)(key, context);
}

/**
 * Shortcut function for humanizing MetricNotFound errors
 */
export function metricNotFound(metric: DmMetric, params: FormatParams) {
  logger.warn(`${logTag} Query requested '${metric}' but it wasn't found`);
  const mentionError = params.snapshot.query.metadata.mentionMissingMetrics;
  if (!mentionError) return '';

  return humanizeError(
    ErrorType.QueryResponse_MetricNotFound,
    params.snapshot.query.locale,
    metric
  );
}
