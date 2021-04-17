import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import * as firestoreHooks from "react-firebase-hooks/firestore";
import EditSettings, { returnHandleSettingsSave } from "./EditSettings";
import { FirebaseUserDocumentContext } from "../App";
import { firestore } from "../lib/firebase";
import { mockUserDocument } from "../lib/__mocks__/firebase";
import { mockFormData } from "../lib/__mocks__/settings";
import { FIRESTORE_DEFAULT_SET_OPTIONS } from "../lib/firebase-helpers";

// move to __mocks__
jest.mock("../lib/firebase.ts", () => {
  return {
    firestore: {
      doc: jest.fn().mockReturnValue({
        set: jest.fn(),
      }),
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
}));

jest.mock("../components/SettingsForm.tsx", () => {
  return {
    __esModule: true,
    default: () => {
      return <div>SettingsForm</div>;
    },
  };
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const mockDocPath = "users/alf@melmac.com";

describe("EditSettings", () => {
  const mockFirestoreDoc = {
    ...mockUserDocument,
    get: jest.fn().mockReturnValue("a value"),
  };
  it("Renders the component when loaded, with no axe violations", async () => {
    // @ts-ignore
    firestoreHooks.useDocument = jest
      .fn()
      .mockReturnValue([mockFirestoreDoc, false, undefined]);

    const { container } = render(
      <FirebaseUserDocumentContext.Provider value={mockDocPath}>
        <EditSettings />
      </FirebaseUserDocumentContext.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Renders the component when loaded and user has heard disclaimer, with no axe violations", async () => {
    // @ts-ignore
    firestoreHooks.useDocument = jest.fn().mockReturnValue([
      {
        ...mockFirestoreDoc,
        heardDiscalimer: true,
      },
      false,
      undefined,
    ]);

    const { container } = render(
      <FirebaseUserDocumentContext.Provider value={mockDocPath}>
        <EditSettings />
      </FirebaseUserDocumentContext.Provider>
    );

    expect(await screen.findByText("settings.betaBanner")).toBeTruthy();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Renders the component when loading, with no axe violations", async () => {
    // @ts-ignore
    firestoreHooks.useDocument = jest
      .fn()
      .mockReturnValue([undefined, true, undefined]);

    const { container } = render(
      <FirebaseUserDocumentContext.Provider value={mockDocPath}>
        <EditSettings />
      </FirebaseUserDocumentContext.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Renders the component with error, with no axe violations", async () => {
    // @ts-ignore
    firestoreHooks.useDocument = jest
      .fn()
      .mockReturnValue([undefined, false, new Error("you blew it")]);

    const { container } = render(
      <FirebaseUserDocumentContext.Provider value={mockDocPath}>
        <EditSettings />
      </FirebaseUserDocumentContext.Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("returnHandleSettingsSave", () => {
  it("returns a callable submit handler", () => {
    const mockSet = jest.fn();
    (firestore.doc as jest.Mock).mockReturnValue({
      set: mockSet,
    });

    const handler = returnHandleSettingsSave(mockDocPath);
    expect(handler).toBeInstanceOf(Function);

    handler(mockFormData);
    expect(firestore.doc).toHaveBeenCalledWith(mockDocPath);
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith(
      expect.any(Object),
      FIRESTORE_DEFAULT_SET_OPTIONS
    );
  });

  it("returns a callable submit handler that handles error", async () => {
    expect.assertions(1);
    const handler = returnHandleSettingsSave(mockDocPath);
    (firestore.doc as jest.Mock).mockReturnValue({
      set: jest.fn().mockImplementationOnce(() => {
        throw new Error("tried my best!");
      }),
    });
    try {
      await handler(mockFormData);
    } catch (e) {
      expect(e).toMatchInlineSnapshot(
        `[Error: error saving document tried my best!]`
      );
    }
  });
});
