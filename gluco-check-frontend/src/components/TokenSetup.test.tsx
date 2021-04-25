import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe } from "jest-axe";
import TokenSetup from "./TokenSetup";

afterEach(() => {
  cleanup();
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

describe("TokenSetup component", () => {
  it("renders the component", () => {
    const { container } = render(<TokenSetup />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<TokenSetup />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
