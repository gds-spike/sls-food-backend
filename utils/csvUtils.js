const transformCsv = (csv) => {
  const csvWithUnitPadding = addPaddingToUnit(csv);
  const csvWithPostalCode = addPostalCodeUnit(csvWithUnitPadding);
  const transformedCsv = [...getProfileRows(csvWithPostalCode)];

  return transformedCsv;
};

const addPaddingToUnit = (csv) =>
  csv.map((row) => {
    let unit = row.unit;
    let dashPosition = unit.indexOf('-');

    if (dashPosition <= 0) return { ...row, unit: unit.padStart(3, '0') };

    if (unit.length <= dashPosition + 1) return row;
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
    SK: `#PROFILESOURCE#${row.dataSource}`,
  }));

module.exports = {
  transformCsv,
  addPaddingToUnit,
};
