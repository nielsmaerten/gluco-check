import React from "react";
import { auth } from "./lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { getDocumentPathForUser } from "./lib/firebase-helpers";
import { useTranslation } from "react-i18next";
import {
  AppBar,
  Container,
  IconButton,
  makeStyles,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { GitHub, Help } from "@material-ui/icons";

import Landing from "./pages/Landing";
import LanguageSelector from "./components/LanguageSelector";
import EditSettings from "./pages/EditSettings";
import Welcome from "./pages/Welcome";
import "./App.css";
import { FAQS_URL, GLUCO_CHECK_GITHUB_URL } from "./lib/constants";
import { AvailableLanguage } from "./lib/enums";

export const FirebaseUserDocumentContext = React.createContext("");

const useStyles = makeStyles((theme) => ({
  root: {
    "@media (prefers-reduced-motion: reduce)": {
      "& *": {
        animationDuration: "0.001ms !important",
        animationIterationCount: "1 !important",
        transitionDuration: "0.001ms !important",
      },
    },
  },
  container: {
    height: "100%",
  },
  surface: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  leftToolbar: {},
  rightToolbar: {
    marginLeft: "auto", // switch to logical
    marginRight: -12,
  },
  nav: {
    "&, & > li": {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
    "& > li": {
      display: "inline-block",
    },
  },
  toolbar: {},
  navTitle: {
    "& a": {
      color: "white",
      textDecoration: "none",
    },
  },
}));

export default function App() {
  const classes = useStyles();
  const [user, loading] = useAuthState(auth);
  const { t, i18n } = useTranslation();
  const docPath = user ? getDocumentPathForUser(user) : ""; // TODO: we don't want this empty path to be possible, AND we want to auth protect any other authed routes

  let Content: React.ReactElement | null = null;
  if (user) {
    Content = <Welcome />;
  } else {
    if (!loading) {
      Content = <Landing />;
    }
  }

  const navigation = (
    <AppBar position="sticky">
      <Toolbar variant="regular" className={classes.toolbar}>
        <section className={classes.leftToolbar}>
          <Typography variant="h6" component="h1" className={classes.navTitle}>
            <Link to={`/${i18n.language}`}>{t("title")}</Link>
          </Typography>
        </section>
        <section className={classes.rightToolbar}>
          <ul className={classes.nav}>
            {Object.values(AvailableLanguage).length > 1 && (
              <li>
                <LanguageSelector />
              </li>
            )}
            <li>
              <IconButton
                aria-label={t("navigation.faqs")}
                color="inherit"
                data-testid="navigation-home"
                href={FAQS_URL}
              >
                <Help />
              </IconButton>
            </li>
            <li>
              <IconButton
                aria-label={t("navigation.github")}
                color="inherit"
                data-testid="navigation-contribute"
                href={GLUCO_CHECK_GITHUB_URL}
                target="_contribute"
              >
                <GitHub />
              </IconButton>
            </li>
          </ul>
        </section>
      </Toolbar>
    </AppBar>
  );

  const availableLanguageParams = Object.values(AvailableLanguage).join("|");
  const localesParamString = `/:locale(${availableLanguageParams})`;

  return (
    <div className={classes.root}>
      <Router>
        {navigation}
        <Container maxWidth="md" className={classes.container}>
          <Paper variant="elevation" className={classes.surface}>
            <Switch>
              <Redirect
                exact
                from="/settings"
                to={`/${i18n.language}/settings`}
              />
              <Redirect exact from="/" to={`/${i18n.language}`} />
              {user && (
                <Route path={`${localesParamString}/settings`}>
                  <FirebaseUserDocumentContext.Provider value={docPath}>
                    <EditSettings />
                  </FirebaseUserDocumentContext.Provider>
                </Route>
              )}
              <Route path={`${localesParamString}/`}>{Content}</Route>
            </Switch>
          </Paper>
        </Container>
      </Router>
    </div>
  );
}
