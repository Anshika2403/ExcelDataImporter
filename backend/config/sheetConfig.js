const { isCurrentMonth, isPreviousMonth } = require("../utils/date");

const defaultSheet = {
  name: "Default",
  columns: {
    Name: {
      dbField: "name",
      required: true,
    },
    Amount: {
      dbField: "amount",
      required: true,
      type: "number",
      min: 0.1,
    },
    Date: {
      dbField: "date",
      required: true,
      type: "date",
      validator: isCurrentMonth,
    },
    Verified: {
      dbField: "verified",
      required: false,
      type: "boolean",
    },
  },
};

const customSheet = {
  name: "Custom",
  columns: {
    Name: {
      ...defaultSheet.columns.Name,
    },
    Amount: {
      dbField: "amount",
      required: true,
      type: "number",
      min: 0,
    },
    InvoiceDate: {
      dbField: "invoiceDate",
      required: true,
      type: "date",
      validator: (date) => isCurrentMonth(date) || isPreviousMonth(date),
    },
    ReceiptDate: {
      dbField: "receiptDate",
      required: true,
      type: "date",
      validator: isCurrentMonth,
    },
    Verified: {
      dbField: "verified",
      required: false,
      type: "string",
    },
    //add other fields here
  },
};

module.exports = { defaultSheet, customSheet };
