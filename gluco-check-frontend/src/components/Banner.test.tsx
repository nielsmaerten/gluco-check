import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import Banner from "./Banner";

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      i18n: {
        language: "debug",
      },
      t: jest.fn().mockImplementation((i) => {
        return i;
      }),
    };
  },
}));

describe("Banner", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // @ts-ignore
    delete window.location;
    window.location = {
      ...originalLocation,
      assign: jest.fn(),
    };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it("renders the component", () => {
    const { container } = render(<Banner />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("navigates when button is clicked", async () => {
    render(<Banner />);
    const button = await screen.findByRole("button");
    await userEvent.click(button);
    expect(window.location.assign).toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Banner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
