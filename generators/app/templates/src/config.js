'use strict';

//@ts-ignore
const pjson = require('../package.json');

const app = {
  environment: process.env.NODE_ENV || 'development',
  name: pjson.name,
  version: pjson.version
};

module.exports = {
  app
};
