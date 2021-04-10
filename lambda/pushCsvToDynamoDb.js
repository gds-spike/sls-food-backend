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
    Key: `${key.replace('2-uploads/', '3-processed/')}`,
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
