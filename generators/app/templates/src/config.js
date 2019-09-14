'use strict';

const pjson = require('../package.json');

const app = {
  environment: process.env.NODE_ENV || 'development',
  name: pjson.name,
  version: pjson.version
};

const logging = {
  host: process.env.LOGGING_HOSTNAME || 'http://enterpriseapiesdev:9200',
  password: process.env.ELASTIC_SEARCH_PASSWORD || '',
  username: 'esenterpriseapi'
};

const retry = {
  backoffBase: '1',
  backoffExponent: '2.0',
  max: '2'
};

const vault = {
  appRole: `${app.environment}-${app.name}`,
  role: process.env.VAULT_ROLE || '',
  secret: process.env.VAULT_SECRET || '',
  url: process.env.VAULT_URL || 'https://nonprodvault.service.nonprodconsul:8200/v1'
};

module.exports = {
  app,
  logging,
  retry,
  vault
};
