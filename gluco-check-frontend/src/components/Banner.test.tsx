import { render } from "@testing-library/react";
import Banner from "./Banner";

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      i18n: {
        language: 'debug'
      },
      t: jest.fn().mockImplementation((i) => {
        return i;
      }),
    };
  },
  Trans: function (props: any) {
    return <span>{props.i18nKey}</span>;
  },
}));

describe("Banner component", () => {
  it("renders", async () => {
    const { container } = render(<Banner />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
