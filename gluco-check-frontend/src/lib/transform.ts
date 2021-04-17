import { DiabetesMetric } from "./enums";
import { GlucoCheckUserDocument, SettingsFormData } from "./types";

export const userSettingsFormDataToUserSettingsDocument = (
  data: SettingsFormData
): Partial<GlucoCheckUserDocument> => {
  // Because we want to _display_ these all checked
  // to user if everything is selected, but only
  // actually persist the everything field, filter
  // this down here.
  // TODO: enforce this in firestore rules as well.
  const filteredMetrics = data.defaultMetrics.includes(
    DiabetesMetric.Everything
  )
    ? [DiabetesMetric.Everything]
    : data.defaultMetrics;
  return {
    defaultMetrics: filteredMetrics,
    glucoseUnit: data.glucoseUnit,
    nightscout: {
      token: data.nightscoutToken,
      url: data.nightscoutUrl,
    },
  };
};
