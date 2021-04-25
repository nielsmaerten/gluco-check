import React, { ReactNode } from "react";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeOptions,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";

type ThemeWithMediaProviderProps = {
  lightThemeOptions: ThemeOptions;
  darkThemeOptions: ThemeOptions;
  children: ReactNode;
};

// Component for mixing user media preferences into MUI theme,
// currently used to add dark mode support
function ThemeWithMediaProvider({
  children,
  lightThemeOptions,
  darkThemeOptions,
}: ThemeWithMediaProviderProps) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(() => {
    let themeToBlend = prefersDark ? darkThemeOptions : lightThemeOptions;
    let blendedTheme = createMuiTheme({
      palette: {
        type: prefersDark ? "dark" : "light",
      },
      ...themeToBlend,
    });
    blendedTheme = responsiveFontSizes(blendedTheme);
    return blendedTheme;
  }, [prefersDark, lightThemeOptions, darkThemeOptions]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default ThemeWithMediaProvider;
