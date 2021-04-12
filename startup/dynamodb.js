'use strict';

const aws = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

aws.config.update({
  region: 'ap-southeast-1',
});

let options = {};

// connect to local DB if running offline
// if (process.env.IS_OFFLINE) {
//   options = {
//     region: 'localhost',
//     endpoint: 'http://localhost:8000',
//   };
// }

const client = new aws.DynamoDB.DocumentClient(options);

module.exports = client;
