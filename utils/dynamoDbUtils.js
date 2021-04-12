var docClient = require('../startup/dynamodb');

const putItemIntoDynamo = (params) => docClient.put(params).promise();

const putArrayIntoDynamo = async (arr) =>
  await Promise.all(
    arr.map(async (row) => {
      const params = {
        TableName: process.env.FOOD_TABLE,
        Item: row,
      };

      await putItemIntoDynamo(params);

      try {
      } catch (error) {
        console.log('Unable to add row', row.No, error.message);
      }
    }),
  );

const queryDynamo = (params) => docClient.query(params).promise();

module.exports = {
  putArrayIntoDynamo,
  queryDynamo,
};
