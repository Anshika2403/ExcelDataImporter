const ExcelJS = require("exceljs");

const getSheetsInFile = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return workbook.worksheets.map((sheet) => sheet.name);
};

const getRowsInSheet = async (filePath, sheetName) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(sheetName);
  if (!worksheet) {
    console.log(`Sheet with name "${sheetName}" not found.`);
    throw new Error(`Sheet with name "${sheetName}" not found.`);
  }

  const rows = [];
  let headers = [];

  worksheet.eachRow((row, rowNumber) => {
    const rowValues = row.values.slice(1); // Exclude the first empty element
    if (rowNumber === 1) {
      headers = rowValues;
    } else {
      rows.push(rowValues);
    }
  });
  console.log(rows);

  return { headers, rows };
};

const deleteRowFromSheet = async (filePath, sheetName, rowNumber) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      throw new Error("Sheet not found");
    }

    if (rowNumber <= 0 || rowNumber > worksheet.rowCount) {
      throw new Error("Invalid row number");
    }

    // Remove the row
    worksheet.spliceRows(parseInt(rowNumber), 1);

    // Save the updated file
    await workbook.xlsx.writeFile(filePath);

    return `Row ${rowNumber} deleted successfully`;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { getSheetsInFile, getRowsInSheet, deleteRowFromSheet };
