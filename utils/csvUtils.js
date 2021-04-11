const { padUnit } = require('./transformUtils');

const transformCsv = (csv) => {
  const csvWithUnitPadding = addPaddingToUnit(csv);
  const csvWithPostalCode = addPostalCodeUnit(csvWithUnitPadding);
  const transformedCsv = [
    ...getProfileRows(csvWithPostalCode),
    ...getProgrammeRows(csvWithPostalCode),
  ];

  return transformedCsv;
};

const addPaddingToUnit = (csv) => csv.map((row) => ({ ...row, unit: padUnit(row.unit) }));

const addPostalCodeUnit = (csv) =>
  csv.map((row) => ({ ...row, postalCodeUnit: `${row.postalCode}-${row.unit}` }));

const getProfileRows = (csv) =>
  csv
    .map((row) => ({
      ...row,
      PK: `CLIENT#${row.postalCodeUnit}`,
      SK: `#SOURCE#${row.dataSource}`,
    }))
    // Indicate columns to drop for client info
    .map(({ startDate, endDate, frequency, regularity, programmeName, ...rest }) => rest);

const getProgrammeRows = (csv) =>
  csv
    .map((row) => ({
      ...row,
      PK: `CLIENT#${row.postalCodeUnit}`,
      SK: `#PROGRAMME#${row.programmeName}`,
    }))
    // Indicate the columns to keep for programme info
    .map(({ PK, SK, programmeName, startDate, endDate, frequency, regularity }) => ({
      PK,
      SK,
      programmeName,
      startDate,
      endDate,
      frequency,
      regularity,
    }));

module.exports = {
  transformCsv,
  addPaddingToUnit,
};
