const { processFile } = require("../services/fileProcessor");
const fs = require("fs");
const NotFound = require("../customError/NotFound");
const {
  getSheetsInFile,
  getRowsInSheet,
  deleteRowFromSheet,
} = require("../services/sheetService");

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new NotFound());
    }

    const sheets = await getSheetsInFile(req.file.path);
    res.json({ sheets });
  } catch (error) {
    console.log(error);
  }
};

const getRows = async (req, res, next) => {
  try {
    const { filename, sheetName } = req.params;
    const filePath = `uploads/${filename}`;
    if (!filename) {
      return next(new NotFound());
    }
    const result = await getRowsInSheet(filePath, sheetName);
    res.json({ headers: result.headers, rows: result.rows });
  } catch (error) {
    console.log(error);
  }
};

const deleteRow = async (req, res, next) => {
  try {
    const { filename, sheetName, rowNumber } = req.params;
    const filePath = `uploads/${filename}`;

    if (!fs.existsSync(filePath)) {
      return next(new NotFound());
    }

    const result = await deleteRowFromSheet(filePath, sheetName, rowNumber);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

const addtoDatabase = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;

    if (!fs.existsSync(filePath)) {
      return next(new NotFound());
    }
    const result = await processFile(filePath);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { uploadFile, getRows, deleteRow, addtoDatabase };
