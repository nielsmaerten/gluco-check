// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "reflect-metadata";
import "@testing-library/jest-dom/extend-expect";
import { toHaveNoViolations } from "jest-axe";
import "mutationobserver-shim";

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: jest.fn().mockImplementation((i) => i),
    };
  },
}));

expect.extend(toHaveNoViolations);
