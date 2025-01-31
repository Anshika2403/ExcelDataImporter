const express = require("express")
const { upload } = require("../middleware/fileUpload")
const { uploadFile,getRows,deleteRow,addtoDatabase} = require("../controllers/fileControllers")

const router = express.Router()

router.post("/upload", upload.single("file"), uploadFile)
router.get("/rows/:filename/:sheetName", getRows)
router.delete("/rows/:filename/:sheetName/:rowNumber", deleteRow)
router.post("/addDb/:filename", addtoDatabase)

module.exports = router

