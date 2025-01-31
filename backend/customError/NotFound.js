class NotFound extends Error {
  constructor(message = "No file uploaded") {
    super(message); // Call the parent constructor with the error message
    this.name = "NoFileUploadedError"; // Set the error name
    this.statusCode = 400; // Set the status code (400 - Bad Request)
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}

module.exports = { NotFound };