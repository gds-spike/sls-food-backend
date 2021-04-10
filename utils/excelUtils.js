const XLSX = require('xlsx');

const getWorkbookFromBuffer = (buffer) => XLSX.read(buffer);

const getCsvFromWorkbook = (workbook, sheetName) =>
  XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName], {
    blankrows: false,
    strip: true,
    skipHidden: true,
  });

const formatCsvWithConfig = (originalCsv, sheetConfig) => {
  const headersStr = sheetConfig.headers.join(',');
  const cleanCsvArr = originalCsv
    .replace(/\r\n/g, '') // replace carriage characters within some cells so splitting is accurate next
    .split('\n') // split into array
    .slice(sheetConfig.trimTopRows) // trim top N rows from config
    .filter((row) => row.replace("'", '')); // remove empty rows

  return [headersStr, ...cleanCsvArr].join('\n');
};

module.exports = {
  getWorkbookFromBuffer,
  getCsvFromWorkbook,
  formatCsvWithConfig,
};
