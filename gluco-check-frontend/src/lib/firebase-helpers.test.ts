import { getDocumentPathForUser } from "./firebase-helpers";
import { mockUser } from './__mocks__/firebase'

describe("getDocumentPathForUser", () => {
  it("returns the expected document path", () => {
    // @ts-ignore
    expect(getDocumentPathForUser(mockUser)).toMatchInlineSnapshot(
      `"users/example@example.com"`
    );
  });
});
