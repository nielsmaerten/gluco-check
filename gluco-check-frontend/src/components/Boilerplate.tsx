import React, { ReactEventHandler } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  legal: {
    "& p": {
      fontSize: ".7rem",
    },
    "& a": {
      fontSize: ".7rem",
      cursor: "pointer",
      color: theme.palette.text.primary,
      textDecoration: "underline",
    },
  },
}));

type BoilerplateProps = {
  handleSignoutClicked?: ReactEventHandler;
};

function Boilerplate({ handleSignoutClicked }: BoilerplateProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <Typography>
        {handleSignoutClicked && (
          <Link variant="body2" color="error" onClick={handleSignoutClicked}>
            {t("boilerplate.logout")}
          </Link>
        )}
      </Typography>
      <div className={classes.legal}>
        <Typography>
          <Trans i18nKey="boilerplate.terms">
            By continuing, you are indicating that you accept our{" "}
            <Link href={t("urls.termsAndConditions")}>Terms of Service</Link>{" "}
            and <Link href={t("urls.privacy")}>Privacy Policy</Link>.
          </Trans>
        </Typography>
        <Typography>{t("boilerplate.google")}</Typography>
        <Typography>
          <Trans i18nKey="boilerplate.nightscout">
            Not affiliated with the{" "}
            <Link href={t("urls.nightscoutProject")}>Nightscout Project</Link>
          </Trans>
        </Typography>
      </div>
    </>
  );
}

export default Boilerplate;
