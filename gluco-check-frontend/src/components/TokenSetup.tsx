import React from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
  },
  definitionList: {
    "& dd, & dt": {
      margin: "0px",
      padding: "0px",
    },
    "& dt": {
      fontWeight: "bold",
    },
    "& dd": {
      marginBottom: "1rem",
    },
    "& dd img": {
      maxWidth: "100%",
    },
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

const TOKEN_IMAGE_PATH = `${process.env.PUBLIC_URL}/images/token-instructions`;

export default function TokenSetup() {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography>{t("tokenDialog.preamble")}</Typography>
      <dl className={classes.definitionList}>
        <Typography variant="h5" component="dt">
          {t("tokenDialog.step1.label")}
        </Typography>
        <dd>
          <Trans i18nKey="tokenDialog.step1.description">
            Make sure your site is on at least{" "}
            <a href={t("tokenDialog.links.nightscoutMinimumVersion")}>
              version 14 of Nightscout
            </a>
            . You can check the version here by clicking on the hamburger menu
            button and looking here...
          </Trans>
          <img
            src={`${TOKEN_IMAGE_PATH}/${t("tokenDialog.step1.image")}`}
            alt=""
          />
        </dd>

        <Typography variant="h5" component="dt">
          {t("tokenDialog.step2.label")}
        </Typography>
        <dd>
          <Trans i18nKey="tokenDialog.step2.description">
            If you need an upgrade, you can read more about how to do that{" "}
            <a href={t("tokenDialog.links.howToUpdateNightscout")}>here</a>. If
            you do not need an upgrade... let's goooooo!
          </Trans>
        </dd>

        <Typography variant="h5" component="dt">
          {t("tokenDialog.step3.label")}
        </Typography>
        <dd>
          <p>{t("tokenDialog.step3.description")}</p>
          <p>{t("tokenDialog.step4.description")}</p>
          <Box>
            <img
              src={`${TOKEN_IMAGE_PATH}/${t("tokenDialog.step4.image")}`}
              alt={t("tokenDialog.step4.image_alt")}
            />
          </Box>
          <p>{t("tokenDialog.step5.description")}</p>
          <img
            src={`${TOKEN_IMAGE_PATH}/${t("tokenDialog.step5.image")}`}
            alt={t("tokenDialog.step5.image_alt")}
          />
          <p>
            <Trans i18nKey="tokenDialog.step6.description">
              Copy the value in the "Access Token" column, paste it into the
              Nightscout Token field in{" "}
              <Link to={t("tokenDialog.links.glucoCheckSettings") as string}>
                Gluco-Check Settings
              </Link>
              , and click save.
            </Trans>
          </p>
          <img
            src={`${TOKEN_IMAGE_PATH}/${t("tokenDialog.step6.image")}`}
            alt={t("tokenDialog.step6.image_alt")}
          />
        </dd>
      </dl>
    </div>
  );
}
