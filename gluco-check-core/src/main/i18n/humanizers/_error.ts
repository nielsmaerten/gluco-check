import {i18next} from '..';
import {ErrorType} from '../../../types/ErrorType';
import {DmMetric} from '../../../types/DmMetric';
import FormatParams from '../../../types/FormatParams';

export default function humanizeError(
  errorType: ErrorType,
  locale: string,
  affectedMetric?: DmMetric
): string {
  // Collect translation context
  const context = {
    metric: affectedMetric,
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
  const mentionError = params.snapshot.query.metadata.mentionMissingMetrics;
  if (!mentionError) return '';

  return humanizeError(
    ErrorType.QueryResponse_MetricNotFound,
    params.snapshot.query.locale,
    metric
  );
}
