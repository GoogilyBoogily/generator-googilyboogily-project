'use strict';

const td = require('testdouble');
const test = require('tape-async');

test('run: Should initialize and configure with no issues', async (t) => {
  // Arrange
  let actualError;
  const baseLogger = td.replace('@chr/msft-base-logger');
  const environmentLogger = td.replace('@chr/enterprise-api-environment-logger');
  const exitHandler = td.replace('@chr/enterprise-api-exit-handler');
  const retrier = td.replace('@chr/msft-api-retrier');

  // Act
  try {
    await require('../../../src/index');
  } catch (error) {
    actualError = error;
  }

  // Assert
  t.false(actualError);
  td.verify(baseLogger.configure(td.matchers.anything()));
  td.verify(environmentLogger.log(td.matchers.anything(), td.matchers.anything(), td.matchers.anything()));
  td.verify(exitHandler.configure(td.matchers.anything(), td.matchers.anything()));
  td.verify(retrier.configure(td.matchers.anything(), td.matchers.anything(), td.matchers.anything(), td.matchers.anything()));

  // Cleanup
  td.reset();
  t.end();
});
