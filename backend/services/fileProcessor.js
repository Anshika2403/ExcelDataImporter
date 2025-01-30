const ExcelJS = require("exceljs");
const fs = require("fs");
const validateRow = require("./services/validationRules");
const sheetConfig = require("../config/sheetConfig");
const Data = require("../models/data");

const CHUNK_SIZE = 500;

const processFile = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const results = {};

  for (const worksheet of workbook.worksheets) {
    const sheetName = worksheet.name;

    const config = sheetConfig[sheetName] || sheetConfig.defaultSheet;
    results[sheetName] = {
      valid: 0,
      errors: [],
    };

    let rowNumber = 1;
    let headers;
    let chunk = [];

    for await (const row of worksheet.rows) {
      if (rowNumber === 1) {
        headers = row.values.slice(1);
        rowNumber++;
        continue;
      }
      chunk.push(row.values.slice(1));
      if (chunk.length === CHUNK_SIZE) {
        await processChunk(
          chunk,
          headers,
          config,
          rowNumber - chunk.length,
          results[sheetName]
        );
        chunk = [];
      }
      rowNumber++;
    }
    if (chunk.length > 0) {
      await processChunk(
        chunk,
        headers,
        config,
        rowNumber - chunk.length,
        results[sheetName]
      );
    }
  }
  fs.unlinkSync(filePath);
  return results;
};

const processChunk = async (chunk, headers, config, startRow, sheetResults) => {
    const validRows = [];
    const errorRows = [];

    chunk.forEach((row, index) => {
      const rowData = {};
      let isValid = true;
      const rowErrors = [];

      headers.forEach((header, colIndex) => {
        const columnConfig = Object.entries(config.columns).find(([,cfg]) =>
        cfg.dbField.toLowerCase() === header.toLowerCase())
        if(columnConfig){
            const [columnName, cfg] = columnConfig;
            rowData[cfg.dbField] = row[colIndex];
        }
      });

      const validationResult = validateRow(rowData, config);
      if (!validationResult.isValid) {
        isValid = false;
        rowErrors.push(...validationResult.errors);
      }

      if(isValid){
        validRows.push(rowData);
      }else{
        errorRows.push({
          row: startRow + index,
          errors: rowErrors,
        });
      }
    });
    if (validRows.length > 0) {
        await Data.insertMany(validRows)
        sheetResults.valid += validRows.length
      }
      sheetResults.errors.push(...errorRows)
}
module.exports = {processFile};