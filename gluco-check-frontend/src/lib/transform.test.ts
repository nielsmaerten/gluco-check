import { clone } from "ramda";
import { DiabetesMetric } from "./enums";
import { userSettingsFormDataToUserSettingsDocument } from "./transform";
import { mockFormData } from "./__mocks__/settings";

describe("userSettingsFormDataToUserSettingsDocument", () => {
  it("returns a well formed document", () => {
    const resultDocument = userSettingsFormDataToUserSettingsDocument(
      mockFormData
    );
    expect(resultDocument).toMatchInlineSnapshot(`
      Object {
        "defaultMetrics": Array [
          "blood sugar",
        ],
        "glucoseUnit": "mg/dl",
        "nightscout": Object {
          "token": "I am a token",
          "url": "https://example.com",
        },
      }
    `);
    expect(resultDocument.defaultMetrics).toBe(mockFormData.defaultMetrics);
    expect(resultDocument.nightscout?.token).toEqual(
      mockFormData.nightscoutToken
    );
    expect(resultDocument.nightscout?.url).toEqual(mockFormData.nightscoutUrl);
    expect(resultDocument.glucoseUnit).toEqual(mockFormData.glucoseUnit);
  });
  it("filters out non-everything options when everything is selected in metrics", () => {
    const everythingData = clone(mockFormData);
    everythingData.defaultMetrics = [
      DiabetesMetric.Everything,
      DiabetesMetric.BloodSugar,
    ];

    const resultDocument = userSettingsFormDataToUserSettingsDocument(
      everythingData
    );
    expect(resultDocument.defaultMetrics).toEqual([DiabetesMetric.Everything]);
  });
});
