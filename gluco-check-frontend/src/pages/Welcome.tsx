import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Onboarding from "../components/Onboarding";
import Boilerplate from "../components/Boilerplate";
import { auth } from "../lib/firebase";

export const handleSignoutClicked = () => {
  auth.signOut();
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    textAlign: "center",
  },
  subtitle: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      marginBottom: 0,
      "& h2": {
        fontSize: "1.125rem",
        lineHeight: 1.6,
      },
    },
  },
  bodyContent: {
    "& p": {
      marginBottom: theme.spacing(2),
    },
    "& ul li": {
      listStyle: "none",
      marginBottom: theme.spacing(1),
      fontWeight: 600,
    },
  },
  contentGrid: {
    minHeight: "80vh",
  },
  boilerplate: {
    textAlign: "center",
    marginTop: theme.spacing(2),
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

function Welcome() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
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
            {t("welcome.subtitle")}
          </Typography>
        </Container>
      </Grid>
      <Grid item>
        <Onboarding />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" href="/settings">
          {t("welcome.cta")}
        </Button>
      </Grid>
      <Grid item className={classes.boilerplate}>
        <Boilerplate handleSignoutClicked={handleSignoutClicked} />
      </Grid>
    </Grid>
  );
}

export default Welcome;
