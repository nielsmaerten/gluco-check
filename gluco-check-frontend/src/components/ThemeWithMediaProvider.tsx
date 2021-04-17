import React, { ReactNode } from "react";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeOptions,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";

type ThemeWithMediaProviderProps = {
  themeOptions: ThemeOptions;
  children: ReactNode;
};

// Component for mixing user media preferences into MUI theme,
// currently used to add dark mode support
function ThemeWithMediaProvider({
  children,
  themeOptions,
}: ThemeWithMediaProviderProps) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(() => {
    let blendedTheme = createMuiTheme({
      ...themeOptions,
      palette: {
        type: prefersDark ? "dark" : "light",
      },
    });
    blendedTheme = responsiveFontSizes(blendedTheme);
    return blendedTheme;
  }, [prefersDark, themeOptions]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default ThemeWithMediaProvider;
