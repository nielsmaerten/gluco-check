import loadDayJsLocale from '../../../src/main/i18n/loadDayJsLocale';

describe('loadDayJsLocale', () => {
  it("falls back to 'en' for 'en-US'", async () => {
    const expected = 'en';
    const actual = await loadDayJsLocale('en-US');
    expect(actual).toBe(expected);
  });

  it("falls back to 'nn' for 'no-NO'", async () => {
    const expected = 'nn';
    const actual = await loadDayJsLocale('no-NO');
    expect(actual).toBe(expected);
  });

  it('throws an error if no locale is found', async () => {
    const unsupportedLocale = 'unsupported';
    await expect(loadDayJsLocale(unsupportedLocale)).rejects.toThrow(
      `Could not load locale ${unsupportedLocale}`
    );
  });
});
