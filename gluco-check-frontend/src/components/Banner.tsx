import { Trans, useTranslation } from "react-i18next";
import { Link, makeStyles, useTheme } from "@material-ui/core";

import { TRANSLATOR_RECRUITMENT } from "../lib/constants";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => {
  const themeType = theme.palette.type;
  const backgroundColor = theme.palette.warning[themeType];
  const color = theme.palette.text.primary;
  return {
    alert: {
      backgroundColor,
      color,
    },
    link: {
      color: theme.palette.text.secondary,
    },
  };
});

function Banner() {
  const theme = useTheme();
  const alertVariant = theme.palette.type === "light" ? "outlined" : "filled";
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  return (
    <Alert className={classes.alert} variant={alertVariant} severity="warning">
      <AlertTitle>{t("settings.betaBanner.title")}</AlertTitle>
      {
        // TODO: Properly interpolate this so the link is clickable and takes
        // you to a GitHub discussion (?) depending on the selected language
        // eg href="/join-beta/[es]"
      }
      <Trans i18nKey="settings.betaBanner.message">
      </Trans>
    </Alert>
  );
}

export default Banner;
