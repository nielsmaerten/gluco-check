import { plainToClass } from "class-transformer";
import { NightscoutValidationEndpointResponseDto } from "../NightscoutValidationClient/NightscoutValidationClientDto";

export const MOCK_NSV_RESPONSE_VALID = {
  token: {
    isValid: true,
    parsed: "token123",
  },
  url: {
    isValid: true,
    parsed: "https://example.com",
    pointsToNightscout: true,
  },
  nightscout: {
    glucoseUnit: "mmol",
    minSupportedVersion: "13.0.0",
    version: "14.0.7",
  },
  discoveredMetrics: [
    "blood sugar",
    "insulin on board",
    "carbs on board",
    "sensor age",
    "cannula age",
    "pump battery",
  ],
};

export const MOCK_NSV_RESPONSE_NON_NS_URL = {
  url: {
    parsed: "https://example.com",
    isValid: true,
    pointsToNightscout: false,
  },
  token: {
    parsed: "",
    isValid: false,
  },
  nightscout: {
    version: "",
    glucoseUnit: "",
    minSupportedVersion: "13.0.0",
  },
  discoveredMetrics: [],
};

export const MOCK_NSV_RESPONSE_NS_NEEDS_UPGRADE = {
  token: {
    isValid: false,
    parsed: "token123",
  },
  url: {
    isValid: true,
    parsed: "https://example.com",
    pointsToNightscout: true,
  },
  nightscout: {
    glucoseUnit: "mmol",
    minSupportedVersion: "13.0.0",
    version: "12.9.9",
  },
  discoveredMetrics: [],
};

export const MOCK_NSV_RESPONSE_INVALID_TOKEN = {
  url: {
    parsed: "https://example.com",
    isValid: true,
    pointsToNightscout: true,
  },
  token: {
    isValid: false,
    parsed: "token1234",
  },
  nightscout: {
    minSupportedVersion: "13.0.0",
    glucoseUnit: "mmol",
    version: "14.0.7",
  },
  discoveredMetrics: ["blood sugar"],
};

export const mockNsvResponseDtoValid = plainToClass(
  NightscoutValidationEndpointResponseDto,
  MOCK_NSV_RESPONSE_VALID
);

export const mockNsvResponseDtoNonNsUrl = plainToClass(
  NightscoutValidationEndpointResponseDto,
  MOCK_NSV_RESPONSE_NON_NS_URL
);

export const mockNsvResponseDtoNsNeedsUpgrade = plainToClass(
  NightscoutValidationEndpointResponseDto,
  MOCK_NSV_RESPONSE_NS_NEEDS_UPGRADE
);

export const mockNsvResponseDtoInvalidToken = plainToClass(
  NightscoutValidationEndpointResponseDto,
  MOCK_NSV_RESPONSE_INVALID_TOKEN
);
