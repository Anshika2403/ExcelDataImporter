const ExcelJS = require("exceljs");
const fs = require("fs");
const { validateRow } = require("./validationRules");
const { defaultSheet, customSheet } = require("../config/sheetConfig");
const Data = require("../models/data");

//chunks are created to handle large files
const CHUNK_SIZE = 500;

const sheetConfigs = {
  Default: defaultSheet,
  Custom: customSheet,
};

const processFile = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const results = {};

  //loop over different sheets of file
  for (const worksheet of workbook.worksheets) {
    const sheetName = worksheet.name;

    const config = sheetConfigs[sheetName] || sheetConfigs.Default;
    results[sheetName] = {
      valid: 0,
      errors: [],
    };

    let rowNumber = 1;
    let headers;
    let chunk = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowIndex) => {
      if (rowIndex === 1) {
        //first row is header
        headers = row.values.slice(1);
      } else {
        const rowData = row.values.slice(1);
        // Process rowData as needed
        chunk.push(rowData);
        if (chunk.length === CHUNK_SIZE) {
          processChunk(
            chunk,
            headers,
            config,
            rowNumber - chunk.length,
            results[sheetName]
          );
          chunk = [];
        }
      }
      rowNumber++;
    });

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

  //remove file once data added to database
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
      const columnConfig = Object.entries(config.columns).find(
        ([, cfg]) => cfg.dbField.toLowerCase() === header.toLowerCase()
      );
      if (columnConfig) {
        const [columnName, cfg] = columnConfig;
        rowData[cfg.dbField] = row[colIndex];
      }
    });

    //validate whether correct data is present in file
    const validationResult = validateRow(rowData, config);
    if (!validationResult.isValid) {
      isValid = false;
      rowErrors.push(...validationResult.errors);
    }

    if (isValid) {
      validRows.push(rowData);
    } else {
      errorRows.push({
        //row number having error
        row: startRow + index,
        errors: rowErrors,
      });
    }
  });
  if (validRows.length > 0) {
    //insert data to database
    await Data.insertMany(validRows);
    sheetResults.valid += validRows.length;
  }
  sheetResults.errors.push(...errorRows);
};
module.exports = { processFile };
