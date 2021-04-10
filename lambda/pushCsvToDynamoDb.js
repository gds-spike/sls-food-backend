const bucketFolders = require('../config/bucketFolders');
const { copyFile, deleteFile, getJsonDataFromCsvInS3 } = require('../utils/s3Utils');
const { putArrayIntoDynamo } = require('../utils/dynamoDbUtils');

module.exports.handler = async (event) => {
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
    Key: `${key.replace(bucketFolders.second, bucketFolders.third)}`,
  };

  try {
    let csvData = await getJsonDataFromCsvInS3(params);
    await putArrayIntoDynamo(csvData);
    await copyFile(sourceToDestinationParams);
    await deleteFile(params);
  } catch (error) {
    console.log(error.message);
  }
};
