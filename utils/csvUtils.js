const { getProfileRows, getProgrammeRows, padUnit } = require('./transformUtils');

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

module.exports = {
  transformCsv,
  addPaddingToUnit,
};
