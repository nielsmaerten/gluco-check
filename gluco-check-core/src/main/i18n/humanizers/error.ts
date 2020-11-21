import {i18next} from '../Localizer';
import {ErrorTypes} from '../../../types/ErrorTypes';
import {DiabetesPointer} from '../../../types/DiabetesPointer';
import FormatParams from '../../../types/FormatParams';

export default function humanizeError(
  errorType: ErrorTypes,
  locale: string,
  affectedPointer?: DiabetesPointer
): string {
  // Collect translation context
  const context = {
    pointer: affectedPointer,
  };

  // Build translation key
  const key = `assistant_responses.errors.${errorType}`;

  // Return localized string
  return i18next.getFixedT(locale)(key, context);
}

/**
 * Shortcut function for humanizing PointerNotFound errors
 */
export function pointerNotFound(pointer: DiabetesPointer, params: FormatParams) {
  const mentionError = params.snapshot.originalQuery.metadata.mentionMissingPointers;

  if (!mentionError) return '';
  return humanizeError(ErrorTypes.QueryResponse_PointerNotFound, params.locale, pointer);
}