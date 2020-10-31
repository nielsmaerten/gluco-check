import {i18next} from '../Localizer';
import {ErrorTypes} from '../../../types/ErrorTypes';
import {DiabetesPointer} from '../../../types/DiabetesPointer';

export default async function humanizeError(
  errorType: ErrorTypes,
  locale: string,
  affectedPointer?: DiabetesPointer
): Promise<string> {
  // Collect translation context
  const context = {
    affectedPointer,
  };

  // Build translation key
  const key = `assistant_responses.errors.${errorType}`;

  // Return localized string
  return i18next.getFixedT(locale)(key, context);
}

/**
 * Shortcut function for humanizing PointerNotFound errors
 * @param pointer
 * @param locale
 */
export async function pointerNotFound(pointer: DiabetesPointer, locale: string) {
  return humanizeError(ErrorTypes.QueryResponse_PointerNotFound, locale, pointer);
}
