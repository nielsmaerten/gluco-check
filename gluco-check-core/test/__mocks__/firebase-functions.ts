// Stubs: Logging
const enableLoggingDuringTest = false;
const stub = enableLoggingDuringTest ? console.log : jest.fn();

// Firebase functions.config() mock
const configMock = jest.fn(() => {
  return {
    google_actions_sdk: {
      glucocheck_action_version: '1',
    },
  };
});

module.exports = {
  logger: {
    info: stub,
    error: stub,
    warn: stub,
    debug: stub,
    write: stub,
  },
  config: configMock,
};
