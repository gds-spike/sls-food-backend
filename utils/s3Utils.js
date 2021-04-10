const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const csv = require('csvtojson');

aws.config.update({
  region: 'ap-southeast-1',
});

const copyFile = (params) => s3.copyObject(params).promise();

const deleteFile = (params) => s3.deleteObject(params).promise();

const putFile = (param) => s3.putObject(param).promise();

const getJsonDataFromCsvInS3 = async (params) => {
  // get csv file and create stream
  const stream = s3.getObject(params).createReadStream();
  // convert csv file (stream) to JSON format data
  const json = await csv().fromStream(stream);

  return json;
};

const getBufferFromS3 = (params, callback) => {
  const stream = s3.getObject(params).createReadStream();
  const buffers = [];
  stream.on('data', (data) => buffers.push(data));
  stream.on('end', () => callback(null, Buffer.concat(buffers)));
  stream.on('error', (error) => callback(error));
};

// promisify read stream from s3
const getBufferFromS3Promise = (params) =>
  new Promise((resolve, reject) => {
    getBufferFromS3(params, (err, buffer) => (err ? reject(err) : resolve(buffer)));
  });

module.exports = {
  copyFile,
  deleteFile,
  putFile,
  getJsonDataFromCsvInS3,
  getBufferFromS3Promise,
};
