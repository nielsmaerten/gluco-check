export const docSetStub = jest.fn();

export const stubFirebaseClient = {
  firestore: () => {
    return {
      doc: () => {
        return {
          set: docSetStub,
        };
      },
    };
  },
};
