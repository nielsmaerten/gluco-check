import React, { useContext } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore } from "../lib/firebase";
import {
  DEFAULT_USER_DOCUMENT,
  FIRESTORE_DEFAULT_SET_OPTIONS,
} from "../lib/firebase-helpers";
import { Alert } from "@material-ui/lab";
import { Container, makeStyles, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import SettingsForm from "../components/SettingsForm";
import { SettingsFormData } from "../lib/types";
import {
  APP_DEBUG,
  DEFAULT_GLUCOSE_UNITS,
  FIRESTORE_FIELD_HEARD_DISCLAIMER,
  FIRESTORE_FIELD_PATH_DEFAULT_METRICS,
  FIRESTORE_FIELD_PATH_GLUCOSE_UNITS,
  FIRESTORE_FIELD_PATH_NIGHTSCOUT_TOKEN,
  FIRESTORE_FIELD_PATH_NIGHTSCOUT_URL,
  NIGHTSCOUT_VALIDATION_ENDPOINT_URL,
} from "../lib/constants";
import { userSettingsFormDataToUserSettingsDocument } from "../lib/transform";
import { FirebaseUserDocumentContext } from "../App";
import { NightscoutValidationClient } from "../lib/NightscoutValidationClient/NightscoutValidationClient";

export const returnHandleSettingsSave = (userDocumentPath: string) => {
  return async (data: SettingsFormData) => {
    const formDataAsDocument = userSettingsFormDataToUserSettingsDocument(data);
    try {
      await firestore.doc(userDocumentPath).set(
        {
          ...DEFAULT_USER_DOCUMENT,
          ...formDataAsDocument,
        },
        FIRESTORE_DEFAULT_SET_OPTIONS
      );
    } catch (e) {
      throw new Error(`error saving document ${e.message}`);
    }
  };
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    "& h2": {
      marginBottom: theme.spacing(2),
    },
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
}));

export default function EditSettings() {
  const classes = useStyles();
  const userDocumentPath = useContext(FirebaseUserDocumentContext);
  const userDocumentReference = firestore.doc(userDocumentPath);

  const [document, loading, error] = useDocument(userDocumentReference);

  const { t } = useTranslation();

  const nightscoutUrl =
    document?.get(FIRESTORE_FIELD_PATH_NIGHTSCOUT_URL) ?? "";
  const nightscoutToken =
    document?.get(FIRESTORE_FIELD_PATH_NIGHTSCOUT_TOKEN) ?? "";
  const defaultMetrics =
    document?.get(FIRESTORE_FIELD_PATH_DEFAULT_METRICS) ?? [];
  const glucoseUnit =
    document?.get(FIRESTORE_FIELD_PATH_GLUCOSE_UNITS) ?? DEFAULT_GLUCOSE_UNITS;
  const hasHeardDisclaimer =
    document?.get(FIRESTORE_FIELD_HEARD_DISCLAIMER) ?? false;

  return (
    <Container maxWidth="md" className={classes.container}>
      <Typography variant="h6" component="h2">
        {t("settings.title")}
      </Typography>
      {!hasHeardDisclaimer && (
        <Alert severity="warning" className={classes.alert}>
          {t("settings.betaBanner")}
        </Alert>
      )}

      {loading && <>{t("status.general.loading")}</>}
      {error && (
        <>
          {t("status.general.error")}: {error.message}
        </>
      )}
      {document && (
        <SettingsForm
          nightscoutUrl={nightscoutUrl}
          nightscoutToken={nightscoutToken}
          glucoseUnit={glucoseUnit}
          defaultMetrics={defaultMetrics}
          onSubmit={returnHandleSettingsSave(userDocumentPath)}
          nightscoutValidator={
            new NightscoutValidationClient({
              endpointUrl: NIGHTSCOUT_VALIDATION_ENDPOINT_URL,
            })
          }
          shouldShowGlucoseUnitsField={APP_DEBUG}
        />
      )}
    </Container>
  );
}
