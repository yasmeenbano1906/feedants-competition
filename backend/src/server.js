require("dns").setServers(["8.8.8.8"]);
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const competitionRoutes = require("./routes/competitionRoutes");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api/v1", apiLimiter);

app.use("/api/v1/competitions", competitionRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Feedants backend is running",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });