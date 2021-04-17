import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Boilerplate from "./Boilerplate";
import userEvent from "@testing-library/user-event";

jest.mock("../lib/firebase.ts", () => {
  return {
    auth: {
      signOut: jest.fn(),
    },
  };
});

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: jest.fn().mockImplementation((i) => {
        return i;
      }),
    };
  },
  Trans: function (props: any) {
    return <span>{props.i18nKey}</span>;
  },
}));

afterEach(cleanup);

describe("Landing page", () => {
  const mockHandleSignoutClicked = jest.fn();
  beforeEach(() => {
    mockHandleSignoutClicked.mockReset();
  });
  it("renders the component", async () => {
    const { container } = render(
      <Boilerplate handleSignoutClicked={mockHandleSignoutClicked} />
    );
    expect(container.firstChild).toMatchSnapshot();

    const logoutButton = await screen.findByText("boilerplate.logout");
    expect(logoutButton).toBeTruthy();

    await userEvent.click(logoutButton);
    expect(mockHandleSignoutClicked).toHaveBeenCalled();
  });

  it("renders the component when not authenticated", () => {
    const { container } = render(<Boilerplate />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Boilerplate handleSignoutClicked={mockHandleSignoutClicked} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
