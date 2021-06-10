import { replaceLanguageInPathname } from "./navigation";

describe("route helper methods", () => {
  const mockSupportedLanguages = ["en", "nl"];
  it.each`
    route             | newLanguage | newRoute
    ${`/en/settings`} | ${`nl`}     | ${`/nl/settings`}
    ${`/en`}          | ${`nl`}     | ${`/nl`}
    ${`/en/settings`} | ${`fr`}     | ${`/en/settings`}
  `(
    "$route called with $newLanguage should yield $newRoute",
    ({ route, newLanguage, newRoute }) => {
      expect(
        replaceLanguageInPathname(route, newLanguage, mockSupportedLanguages)
      ).toEqual(newRoute);
    }
  );
});
