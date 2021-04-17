import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import Onboarding from "../components/Onboarding";

import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../lib/firebase";
import Boilerplate from "../components/Boilerplate";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    textAlign: "center",
  },
  subtitle: {
    marginBottom: theme.spacing(3),
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      marginBottom: 0,
      "& h2": {
        fontSize: "1.125rem",
        lineHeight: 1.6,
      },
    },
  },
  contentGrid: {
    minHeight: "80vh",
  },
  utterance: {
    fontWeight: "bold",
  },
  boilerplate: {
    textAlign: "center",
    marginTop: theme.spacing(3),
    "& p": {
      marginBottom: theme.spacing(1),
      [theme.breakpoints.down("sm")]: {
        fontSize: ".7rem",
      },
    },
  },
  ctaContainer: {
    "&.MuiGrid-item": {
      padding: "0",
    },
  },
}));

function Landing() {
  const classes = useStyles();
  const { t } = useTranslation();

  const firebaseUIConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInFlow: "redirect",
    signInSuccessUrl: "/",
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        fullLabel: t("login.buttonLabel"),
      },
    ],
  };

  return (
    <>
      <Grid
        className={classes.contentGrid}
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={2}
        wrap="nowrap"
      >
        <Grid item className={classes.subtitle}>
          <Container maxWidth="sm">
            <Typography variant="h5" component="h2">
              {t("landing.subtitle")}
            </Typography>
          </Container>
        </Grid>
        <Grid item>
          <Onboarding />
        </Grid>
        <Grid item className={classes.ctaContainer}>
          <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
        </Grid>
        <Grid item className={classes.boilerplate}>
          <Boilerplate />
        </Grid>
      </Grid>
    </>
  );
}

export default Landing;
