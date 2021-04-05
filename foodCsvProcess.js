'use strict';
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const csv = require('csvtojson');

module.exports.handler = async (event, context) => {
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  const params = {
    Bucket: bucket,
    Key: key,
  };

  const sourceToDestinationParams = () => ({
    Bucket: bucket,
    CopySource: `${bucket}/${key}`,
    Key: `${key.replace('uploads/', 'processed/')}`,
  });

  try {
    let csvData = await getJsonDataFromS3(params);

    await copyFile(sourceToDestinationParams);
    await deleteFile(params);
    console.log(csvData);

    return {
      statusCode: 200,
      body: JSON.stringify({
        input: event,
        data: csvData,
      }),
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const copyFile = (sourceToDestinationParams) => s3.copyObject(sourceToDestinationParams).promise();

const deleteFile = (sourceParams) => s3.deleteObject(sourceParams).promise();

const getJsonDataFromS3 = async (sourceParams) => {
  // get csv file and create stream
  const stream = s3.getObject(sourceParams).createReadStream();
  // convert csv file (stream) to JSON format data
  const json = await csv().fromStream(stream);

  return json;
};
