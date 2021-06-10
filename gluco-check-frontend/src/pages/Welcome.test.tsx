import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe } from "jest-axe";
import Welcome, { handleSignoutClicked } from "./Welcome";

import { useHistory, BrowserRouter } from "react-router-dom";
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useHistory: jest.fn(),
  };
});
const mockUseHistory = useHistory as jest.Mock;

const mockLanguage = "en";
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: jest.fn().mockImplementation((i) => {
        return i;
      }),
      i18n: {
        language: mockLanguage,
      },
    };
  },
  Trans: function (props: any) {
    return <span>{props.i18nKey}</span>;
  },
}));

import { auth } from "../lib/firebase";
import userEvent from "@testing-library/user-event";
jest.mock("../lib/firebase.ts", () => {
  return {
    auth: {
      signOut: jest.fn(),
    },
  };
});

jest.mock("../components/Onboarding", () => {
  return {
    __esModule: true,
    default: () => {
      return <>Onboarding</>;
    },
  };
});

jest.mock("../components/Boilerplate", () => {
  return {
    __esModule: true,
    default: () => {
      return <>Boilerplate</>;
    },
  };
});

afterEach(cleanup);

describe("Welcome page", () => {
  const mockHistoryPush = jest.fn();
  beforeEach(() => {
    mockUseHistory.mockReturnValue({
      push: mockHistoryPush,
    });
  });
  it("renders the component", async () => {
    expect.assertions(2);
    const { container, getByTestId } = render(
      <BrowserRouter>
        <Welcome />
      </BrowserRouter>
    );
    const settingsButton = getByTestId("settings-button");
    await userEvent.click(settingsButton);
    expect(mockHistoryPush).toBeCalled();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <BrowserRouter>
        <Welcome />
      </BrowserRouter>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("handleSignoutClicked", () => {
  beforeEach(() => {
    (auth.signOut as jest.Mock).mockReset();
  });
  it("Logs the user out when called", () => {
    handleSignoutClicked();
    expect(auth.signOut as jest.Mock).toHaveBeenCalled();
  });
});
