const { processFile } = require("../services/fileProcessingService")

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const results = await processFile(req.file.path)
    res.json(results)
  } catch (error) {
    next(error)
  }
}

module.exports = { uploadFile }

