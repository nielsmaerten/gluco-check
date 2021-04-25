/* istanbul ignore file */
import red from "@material-ui/core/colors/red";
import { ThemeOptions } from "@material-ui/core";
import { amber, blue, grey, indigo, orange } from "@material-ui/core/colors";

export const lightThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
  palette: {
    type: "light",
    text: {
      primary: "#202124",
    },
    primary: {
      main: "#1a73e8",
      contrastText: "#fff",
    },
    secondary: {
      main: blue[700],
    },
    error: {
      main: red[500],
    },
    warning: {
      light: "#e651004b", // deepOrange[800] at 75%
      main: orange[900],
    },
    background: {
      default: "#fff",
    },
  },
};

export const darkThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
  palette: {
    type: "dark",
    text: {
      primary: indigo[50],
    },
    primary: {
      main: indigo[500],
      contrastText: "#fff",
    },
    secondary: {
      main: "#4285f4",
    },
    error: {
      main: red[300],
    },
    warning: {
      light: "#ffca284b", // amber[400] at 75%
      main: amber[400],
    },
    background: {
      default: grey[900],
    },
  },
};
