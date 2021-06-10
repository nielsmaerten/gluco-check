import { AvailableLanguage } from "./enums";

const LANGUAGE_INDEX = 1;
const SLASH = "/";

export const replaceLanguageInPathname = (
  pathname: string,
  newLanguage: string,
  supportedLanguages: string[] = Object.values(AvailableLanguage)
) => {
  const splitRoute = pathname.split(SLASH);
  if (supportedLanguages.includes(newLanguage)) {
    splitRoute[LANGUAGE_INDEX] = newLanguage;
    return splitRoute.join(SLASH);
  }
  return pathname;
};
