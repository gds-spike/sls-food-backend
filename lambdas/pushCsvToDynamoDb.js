const bucketFolders = require('../config/bucketFolders');
const { copyFile, deleteFile, getJsonDataFromCsvInS3 } = require('../utils/s3Utils');
const { putArrayIntoDynamo } = require('../utils/dynamoDbUtils');
const { transformCsv } = require('../utils/csvUtils');

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
    const transformedCsv = transformCsv(csvData);
    console.log(
      `Inserting Records into DynamoDb: file - ${params.Key} length -${transformCsv.length}`,
    );

    await putArrayIntoDynamo(transformedCsv);
    console.log(`Finished Insertion ${params.Key}`);

    await copyFile(sourceToDestinationParams);
    console.log(`File Coped From ${params.Key} to ${bucketFolders.third}`);

    await deleteFile(params);
    console.log(`File Deleted: ${params.Key}`);
  } catch (error) {
    console.log(error.message);
  }
};
