const padUnit = (unit) => {
  let dashPosition = unit.indexOf('-');

  // For dash not found. Take the number as floor
  if (dashPosition < 0) return unit.padStart(3, '0');

  // For unit ending with dash
  if (unit.length === dashPosition + 1) return unit.padStart(4, '0');

  // Under normal scenario, pad floor to 3 digits and unit number to 5 digits
  const floor = unit.substring(0, dashPosition).padStart(3, '0');
  let unitNo = unit.substring(dashPosition + 1);
  unitNo = unitNo.length >= 5 ? unitNo : unitNo.padStart(5, '0');

  return `${floor}-${unitNo}`;
};

const getProfileRows = (csv) =>
  csv
    // Add the index
    .map((row) => ({
      ...row,
      PK: `CLIENT#${row.postalCodeUnit}`,
      SK: `#SOURCE#${row.dataSource}`,
    }))
    // Indicate columns to drop for client info
    .map(({ no, startDate, endDate, frequency, regularity, programmeName, ...rest }) => rest);

const getProgrammeRows = (csv) =>
  csv
    // Filter rows with no programme name
    .filter((row) => !row.programmeName)
    // Add the index
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
  getProfileRows,
  getProgrammeRows,
  padUnit,
};
