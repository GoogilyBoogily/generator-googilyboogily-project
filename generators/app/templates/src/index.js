'use strict';

const baseLogger = require('@chr/msft-base-logger');
const environmentLogger = require('@chr/enterprise-api-environment-logger');
const exitHandler = require('@chr/enterprise-api-exit-handler');
const retrier = require('@chr/msft-api-retrier');

const config = require('./config');

const _cleanup = () => { };

const _retryReporter = (msg) => {
  baseLogger.info(msg);
};

module.exports = (async () => {
  await baseLogger.configure(config.logging);

  exitHandler.configure(_cleanup, baseLogger);

  environmentLogger.log(baseLogger, config.app.name, config.app.version);

  retrier.configure(
    config.retry.backoffBase,
    config.retry.backoffExponent,
    config.retry.max,
    _retryReporter
  );
})();
