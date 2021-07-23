import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";

import { JOIN_BETA } from "../lib/constants";
import { Alert, AlertTitle } from "@material-ui/lab";

function Banner() {
  const { t, i18n } = useTranslation();
  const currentLngName = t(
    `languageSelector.availableLanguageLabels.${i18n.language}`
  );
  function joinBeta() {
    window.location.href = `${JOIN_BETA}/${i18n.language}`;
  }

  return (
    <Alert
      variant="standard"
      severity="warning"
      action={
        <Button variant="contained" size="small" onClick={() => joinBeta()}>
          {t("settings.betaBanner.action")}
        </Button>
      }
    >
      <AlertTitle>{t("settings.betaBanner.title")}</AlertTitle>
      {t("settings.betaBanner.message", { language: currentLngName })}
    </Alert>
  );
}

export default Banner;
