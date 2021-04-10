const bucketFolders = require('../config/bucketFolders');
const sheetsConfig = require('../config/sheetsConfig');
const {
  getWorkbookFromBuffer,
  getCsvFromWorkbook,
  formatCsvWithConfig,
} = require('../utils/excelUtils');
const { deleteFile, putFile, getBufferFromS3Promise } = require('../utils/s3Utils');

module.exports.handler = async (event) => {
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  const params = {
    Bucket: bucket,
    Key: key,
  };

  // create workbook from buffer
  const buffer = await getBufferFromS3Promise(params);
  const workbook = getWorkbookFromBuffer(buffer);

  const sheetNames = workbook.SheetNames;

  try {
    await Promise.all(
      sheetNames.map(async (sheetName) => {
        if (!Object.keys(sheetsConfig).includes(sheetName)) return;
        console.log(`Extracting Csv From Workbook: ${key} - Sheet Name: ${sheetName}`);
        const csv = getCsvFromWorkbook(workbook, sheetName);
        console.log(`Extraction Complete Workbook: ${key} - Sheet Name: ${sheetName}`);

        const param = {
          Bucket: bucket,
          Key: `${bucketFolders.second}${sheetName}.csv`,
          Body: formatCsvWithConfig(csv, sheetsConfig[sheetName]),
        };
        try {
          await putFile(param);
          console.log(`Put File Complete : ${bucketFolders.second}${sheetName}.csv`);
        } catch (error) {
          console.log(param.Key, error.message);
        }
      }),
    );

    await deleteFile(params);
    console.log(`Deleted ${key} - Completed Function`);
  } catch (error) {
    console.log(error.message);
  }
};
