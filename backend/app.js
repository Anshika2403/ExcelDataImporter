require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/fileRoutes")
const { errorHandler } = require("./middleware/errorHandler")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())

// Routes
app.use("/api", fileRoutes)

// Error handling middleware
app.use(errorHandler)

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
