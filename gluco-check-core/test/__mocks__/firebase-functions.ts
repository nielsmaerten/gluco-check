// Stubs: Logging
const enableLoggingDuringTest = false;
const stub = enableLoggingDuringTest ? console.log : jest.fn();

// Firebase functions.config() mock
const configMock = jest.fn(() => {
  return {
    google_actions_sdk: {
      glucocheck_action_version: '1',
    },
    nightscout_for_testers: {
      url: 'https://cgm.example.com',
      token: 'test-token',
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
