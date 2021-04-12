const { padUnit } = require('../utils/transformUtils');
const { queryDynamo } = require('../utils/dynamoDbUtils');

module.exports.handler = async (event) => {
  const transformedUnit = padUnit(event.pathParameters.id.substring(7));
  const postalCode = event.pathParameters.id.substring(0, 6);

  const params = {
    TableName: process.env.FOOD_TABLE,
    KeyConditionExpression: '#PK = :PK and begins_with(#SK, :SK)',
    ExpressionAttributeNames: {
      '#PK': 'PK',
      '#SK': 'SK',
    },
    ExpressionAttributeValues: {
      ':PK': `CLIENT#${postalCode}-${transformedUnit}`,
      ':SK': `#SOURCE#`,
    },
  };

  try {
    const queryOutput = await queryDynamo(params);
    return {
      statusCode: 200,
      body: JSON.stringify(queryOutput.Items),
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: "Couldn't fetch the client profile.",
    };
  }
};
