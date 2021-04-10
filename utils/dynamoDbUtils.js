const aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient();

aws.config.update({
  region: 'ap-southeast-1',
});

const putItemIntoDynamo = (param) => docClient.put(param).promise();

const putArrayIntoDynamo = async (arr) =>
  await Promise.all(
    arr.map(async (row) => {
      const param = {
        TableName: process.env.FOOD_TABLE,
        Item: row,
      };

      await putItemIntoDynamo(param);

      try {
      } catch (error) {
        console.log('Unable to add row', row.No, error.message);
      }
    }),
  );

module.exports = {
  putArrayIntoDynamo,
};
