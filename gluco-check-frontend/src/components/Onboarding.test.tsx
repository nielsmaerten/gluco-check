import React from "react";
import { cleanup, render } from "@testing-library/react";
import { axe } from "jest-axe";
import Onboarding, { questionAndAnswer } from "./Onboarding";

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: jest.fn().mockImplementation((i) => {
        return i;
      }),
    };
  },
}));

jest.mock("pure-react-carousel", () => {
  return {
    __esModule: true,
    CarouselProvider: (props: any) => {
      return <>{props.children}</>;
    },
    Slider: (props: any) => {
      return <>{props.children}</>;
    },
    Slide: (props: any) => {
      return <>{props.children}</>;
    },
    Dot: (props: any) => {
      return <>{props.children}</>;
    },
  };
});

afterEach(cleanup);

describe("Onboarding", () => {
  it("renders the component", () => {
    const { container } = render(<Onboarding />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Onboarding />);
    expect(await axe(container)).toHaveNoViolations();
  });

  describe("questionAndAnswer", () => {
    it("renders the subcomponent", () => {
      expect(
        questionAndAnswer(
          "outerClass",
          "innerClass",
          "What it is",
          "It is good",
          1
        )
      ).toMatchSnapshot();
    });
    it("renders the subcomponent with a long answer string", () => {
      expect(
        questionAndAnswer(
          "outerClass",
          "innerClass",
          "What it is",
          "It is really really really really really good",
          1
        )
      ).toMatchSnapshot();
    });
  });
});
