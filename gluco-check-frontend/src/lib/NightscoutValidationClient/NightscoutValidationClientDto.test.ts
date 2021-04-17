import {
  returnNightscoutValidationEndpointResponseUrlType,
  returnNightscoutValidationEndpointResponseTokenType,
  returnNightscoutValidationEndpointResponseNightscoutType,
  NightscoutValidationEndpointResponseUrl,
  NightscoutValidationEndpointResponseToken,
  NightscoutValidationEndpointResponseNightscout,
  glucoseUnitValidationCondition,
} from "./NightscoutValidationClientDto";

describe("returnNightscoutValidationEndpointResponseUrlType", () => {
  it("returns NightscoutValidationEndpointResponseUrl type", () => {
    expect(returnNightscoutValidationEndpointResponseUrlType()).toBe(
      NightscoutValidationEndpointResponseUrl
    );
  });
});
describe("returnNightscoutValidationEndpointResponseTokenType", () => {
  it("returns NightscoutValidationEndpointResponseToken type", () => {
    expect(returnNightscoutValidationEndpointResponseTokenType()).toBe(
      NightscoutValidationEndpointResponseToken
    );
  });
});
describe("returnNightscoutValidationEndpointResponseNightscoutType", () => {
  it("returns NightscoutValidationEndpointResponseNightscout type", () => {
    expect(returnNightscoutValidationEndpointResponseNightscoutType()).toBe(
      NightscoutValidationEndpointResponseNightscout
    );
  });
});
describe("glucoseUnitValidationCondition", () => {
  it("returns false when glucoseUnit is an empty string", () => {
    expect(glucoseUnitValidationCondition({ glucoseUnit: "" })).toBe(false);
  });
});
