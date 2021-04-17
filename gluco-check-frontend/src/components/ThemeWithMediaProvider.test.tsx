import React from "react";
import { render } from "@testing-library/react";
import { themeOptions } from "../theme";
import ThemeWithMediaProvider from "./ThemeWithMediaProvider";

import { useMediaQuery, createMuiTheme } from "@material-ui/core";
jest.mock("@material-ui/core", () => {
  return {
    __esModule: true,
    ThemeProvider: (props: any) => {
      return <div>{props.children}</div>;
    },
    useMediaQuery: jest.fn().mockReturnValue(true),
    createMuiTheme: jest.fn(),
    responsiveFontSizes: jest.fn(),
  };
});

describe("ThemeWithMediaProvider", () => {
  it("renders the wrapped children", () => {
    const { container } = render(
      <ThemeWithMediaProvider themeOptions={themeOptions}>
        <div>Some Content</div>
      </ThemeWithMediaProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders the appropriate theme when user prefers light", () => {
    expect.assertions(1);
    (useMediaQuery as jest.Mock).mockReturnValueOnce(false);
    (createMuiTheme as jest.Mock).mockImplementationOnce((theme) => {
      expect(theme.palette).toMatchSnapshot();
    });
    render(
      <ThemeWithMediaProvider themeOptions={themeOptions}>
        <div>Some Content</div>
      </ThemeWithMediaProvider>
    );
  });

  it("renders the appropriate theme when user prefers dark", () => {
    expect.assertions(1);
    (useMediaQuery as jest.Mock).mockReturnValueOnce(true);
    (createMuiTheme as jest.Mock).mockImplementationOnce((theme) => {
      expect(theme.palette).toMatchSnapshot();
    });
    render(
      <ThemeWithMediaProvider themeOptions={themeOptions}>
        <div>Some Content</div>
      </ThemeWithMediaProvider>
    );
  });
});
