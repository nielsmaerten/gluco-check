import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import LanguageSelector from "./LanguageSelector";

const mockLanguage = "en";
const mockChangeLanauge = jest.fn();
jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: jest.fn().mockImplementation((i) => {
        return i;
      }),
      i18n: {
        language: mockLanguage,
        changeLanguage: mockChangeLanauge,
      },
    };
  },
}));

import { useHistory, useLocation } from "react-router-dom";
jest.mock("react-router-dom", () => ({
  useHistory: jest.fn(),
  useLocation: jest.fn(),
}));
const mockUseHistory = useHistory as jest.Mock;
const mockUseLocation = useLocation as jest.Mock;

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

describe("LanguageSelector component", () => {
  const mockPathname = "/en/path";
  const mockHistoryPush = jest.fn();

  beforeEach(() => {
    mockUseHistory.mockReturnValue({
      push: mockHistoryPush,
    });
    mockUseLocation.mockReturnValue({
      pathname: mockPathname,
    });
  });
  it("renders the component, handles clicks and selections", async () => {
    const { container } = render(<LanguageSelector />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("handles clicks on button and language selections", async () => {
    const { container } = render(<LanguageSelector />);

    let button = await screen.getByLabelText("languageSelector.buttonLabel");
    expect(button).toBeInTheDocument();
    await button.focus();
    await button.click();
    expect(screen.getAllByRole("menuitem")[0]).toHaveFocus();

    await screen.getAllByRole("menuitem")[1].click();
    expect(mockChangeLanauge).toHaveBeenCalled();
    expect(mockHistoryPush).toHaveBeenCalled();
  });

  it("launches the translation contributions url when that option is selected", async () => {
    expect.assertions(2);
    const windowOpenSpy = jest.spyOn(global.window, "open");
    windowOpenSpy.mockImplementationOnce((url, target, features, replace) => {
      expect(url).toMatchInlineSnapshot(`"https://translate.glucocheck.app"`);
      return null;
    });

    const { container } = render(<LanguageSelector />);

    let button = await screen.getByLabelText("languageSelector.buttonLabel");
    await button.click();
    const allMenuItems = screen.getAllByRole("menuitem");

    await screen.getAllByRole("menuitem")[allMenuItems.length - 1].click();
    expect(windowOpenSpy).toHaveBeenCalled();
  });

  it("Accessibility: has no axe violations", async () => {
    const { container } = render(<LanguageSelector />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
