import { render } from "@testing-library/react";
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

describe("Banner component", () => {
  it("renders", async () => {
    const { container } = render(<Banner />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
