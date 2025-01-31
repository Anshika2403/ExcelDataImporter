const multer = require("multer")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`)
  },
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only .xlsx files are allowed."), false)
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
})

module.exports = { upload }


