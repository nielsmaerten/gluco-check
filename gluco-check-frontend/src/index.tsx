import "reflect-metadata";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { CircularProgress, CssBaseline, Grid } from "@material-ui/core";
import App from "./App";

import "./lib/i18n";
import ThemeWithMediaProvider from "./components/ThemeWithMediaProvider";
import { themeOptions } from "./theme";

ReactDOM.render(
  <Suspense
    fallback={
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    }
  >
    <ThemeWithMediaProvider themeOptions={themeOptions}>
      <CssBaseline />
      <App />
    </ThemeWithMediaProvider>
  </Suspense>,
  document.getElementById("root")
);
