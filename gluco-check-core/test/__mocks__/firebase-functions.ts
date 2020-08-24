const enableLoggingDuringTest = false;

const stub = enableLoggingDuringTest ? console.log : jest.fn();

module.exports = {
  logger: {
    info: stub,
    error: stub,
    warn: stub,
    debug: stub,
    write: stub,
  },
};
