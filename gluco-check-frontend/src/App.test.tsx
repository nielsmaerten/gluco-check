import React from "react";
import { render, cleanup } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { auth } from "./lib/firebase";
import * as firebaseAuthHooks from "react-firebase-hooks/auth";
import App from "./App";
import { mockUser } from "./lib/__mocks__/firebase";
import { act } from "react-dom/test-utils";

jest.mock("./lib/firebase.ts", () => {
  return {
    auth: {
      signOut: jest.fn(),
    },
  };
});

jest.mock("./pages/EditSettings.tsx", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>EditSettings</div>;
    },
  };
});

jest.mock("./pages/Landing.tsx", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>Landing</div>;
    },
  };
});

jest.mock("./pages/Welcome.tsx", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>Welcome</div>;
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("App component", () => {
  it("renders the component when user loading", () => {
    // @ts-ignore
    firebaseAuthHooks.useAuthState = jest
      .fn()
      .mockReturnValue([undefined, true]);
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders the component when user loaded", async () => {
    // @ts-ignore
    firebaseAuthHooks.useAuthState = jest
      .fn()
      .mockReturnValue([mockUser, false]);
    const { container, findByTestId } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders the component when no user and no loading", () => {
    // @ts-ignore
    firebaseAuthHooks.useAuthState = jest
      .fn()
      .mockReturnValue([undefined, false]);
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("has no axe violations", async () => {
    // @ts-ignore
    firebaseAuthHooks.useAuthState = jest
      .fn()
      .mockReturnValue([mockUser, false]);
    const { container } = render(<App />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
