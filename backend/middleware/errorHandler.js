const multer = require("multer")
const { NotFound } = require("../customError/NotFound")

const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: "File upload error", details: err.message })
  }
  if (err instanceof NotFound) {
    return res.status(400).json({ error: "No file found", details: err.message })
  }

  res.status(500).json({ error: "Internal server error", details: err.message })
}

module.exports = { errorHandler }