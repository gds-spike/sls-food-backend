const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const XLSX = require('xlsx');
const sheetsConfig = require('../sheetsConfig');

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

  // create workbook from buffer
  const buffer = await getBufferFromS3Promise(params);
  const workbook = XLSX.read(buffer);

  const sheetNames = workbook.SheetNames;

  try {
    await Promise.all(
      sheetNames.map(async (sheetName) => {
        if (!Object.keys(sheetsConfig).includes(sheetName)) return;

        const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName], {
          blankrows: false,
          strip: true,
        });

        const finalCsv = generateFinalCsv(csv, sheetsConfig[sheetName]);

        const param = {
          Bucket: bucket,
          Key: `temp/${sheetName}.csv`,
          Body: finalCsv,
        };
        try {
          await s3.putObject(param).promise();
        } catch (error) {
          console.log(param.Key, error.message);
        }
      }),
    );
  } catch (error) {
    console.log(error.message);
  }
};

const getBufferFromS3 = (params, callback) => {
  const stream = s3.getObject(params).createReadStream();
  const buffers = [];
  stream.on('data', (data) => buffers.push(data));
  stream.on('end', () => callback(null, Buffer.concat(buffers)));
  stream.on('error', (error) => callback(error));
};

// promisify read stream from s3
function getBufferFromS3Promise(params) {
  return new Promise((resolve, reject) => {
    getBufferFromS3(params, (error, s3buffer) => {
      if (error) return reject(error);
      return resolve(s3buffer);
    });
  });
}

const generateFinalCsv = (originalCsv, sheetConfig) => {
  const headersStr = sheetConfig.headers.join(',');
  const cleanCsvArr = originalCsv
    .replace(/\r\n/g, '') // replace carriage characters within some cells so splitting is accurate next
    .split('\n') // split into array
    .slice(sheetConfig.trimTopRows) // trim top N rows from config
    .filter((row) => row.replace("'", '')); // remove empty rows

  return [headersStr, ...cleanCsvArr].join('\n');
};
