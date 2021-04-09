'use strict';
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const csv = require('csvtojson');
var docClient = new aws.DynamoDB.DocumentClient();

aws.config.update({
  region: 'ap-southeast-1',
});

module.exports.handler = async (event, context) => {
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  const params = {
    Bucket: bucket,
    Key: key,
  };

  const sourceToDestinationParams = {
    Bucket: bucket,
    CopySource: `${bucket}/${key}`,
    Key: `${key.replace('2-uploads/', '3-processed/')}`,
  };

  try {
    let csvData = await getJsonDataFromS3(params);
    console.log(csvData);

    await putIntoDynamoDb(csvData);
    await copyFile(sourceToDestinationParams);
    await deleteFile(params);

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
};

const copyFile = (sourceToDestinationParams) => s3.copyObject(sourceToDestinationParams).promise();

const deleteFile = (sourceParams) => s3.deleteObject(sourceParams).promise();

const getJsonDataFromS3 = async (params) => {
  // get csv file and create stream
  const stream = s3.getObject(params).createReadStream();
  // convert csv file (stream) to JSON format data
  const json = await csv().fromStream(stream);

  return json;
};

const putIntoDynamoDb = async (arr) =>
  await Promise.all(
    arr.map(async (row) => {
      const params = {
        TableName: process.env.FOOD_TABLE,
        Item: row,
      };

      try {
        await docClient.put(params).promise();
      } catch (error) {
        console.log('Unable to add row', row.No, error.message);
      }
    }),
  );
