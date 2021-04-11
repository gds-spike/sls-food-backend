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

module.exports = {
  padUnit,
};
