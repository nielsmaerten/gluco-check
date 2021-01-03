export default function selectFallbackLocale(locale: string) {
  return toCustomLocale(locale) || toGenericLocale(locale);
}

/**
 * Returns a custom locale if one is defined
 * @param locale Full locale such as en-US, sv-SE, ...
 */
function toCustomLocale(locale: string) {
  return customFallbackMap.get(locale);
}

/**
 * Returns a locale that can be used as generic
 * @param locale Full locale such as en-US, sv-SE, ...
 */
function toGenericLocale(locale: string) {
  const twoLetterLnCode = locale.substr(0, 2);

  const fallback = genericFallbackMap.get(twoLetterLnCode);
  if (fallback) return fallback;
  else {
    const e = `[SelectFallbackLocale]: Unable to find a resource bundle for '${locale}'.`;
    throw new Error(e);
  }
}

const genericFallbackMap = new Map<string, string>([
  // Map generic locales to specific locales here
  ['en', 'en-US'],
  ['da', 'da-DK'],
  ['de', 'de-DE'],
  ['es', 'es-ES'],
  ['fr', 'fr-FR'],
  ['it', 'it-IT'],
  ['nl', 'nl-NL'],
  ['pl', 'pl-PL'],
  ['pt', 'pt-BR'],
  ['ru', 'ru-RU'],
  ['sv', 'sv-SE'],
]);

const customFallbackMap = new Map<string, string>([
  // Add custom mappings here
  // ['no-NO', 'nb-NB']
]);
