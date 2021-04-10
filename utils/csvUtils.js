const transformCsv = (csv) => {
  let transformedCsv = addPaddingToUnit(csv);
  transformedCsv = addPostalCodeUnit(csv);

  transformedCsv = [...getProfileRows(transformedCsv)];

  return transformedCsv;
};

const addPaddingToUnit = (csv) =>
  csv.map((row) => {
    let unit = row.unit;
    let dashPosition = unit.indexOf('-');

    if (dashPosition <= 0 || unit.length <= dashPosition + 1) return row;
    const floor = unit.substring(0, dashPosition).padStart(3, '0');

    let unitNo = unit.substring(dashPosition + 1);
    unitNo = unitNo.length >= 5 ? unitNo : unitNo.padStart(5, '0');

    return { ...row, unit: `${floor}-${unitNo}` };
  });

const addPostalCodeUnit = (csv) =>
  csv.map((row) => ({ ...row, postalCodeUnit: `${row.postalCode}-${row.unit}` }));

const getProfileRows = (csv) =>
  csv.map((row) => ({
    ...row,
    PK: `CLIENT#${row.postalCodeUnit}`,
    SK: `#PROFILE#${row.postalCodeUnit}`,
  }));

module.exports = {
  transformCsv,
};
