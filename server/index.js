const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
require("./Models/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const AuthRouter = require("./Routes/Router");

const app = express();

const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

// CORS first
app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (frontendURL === origin) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Security headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// Parsers
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again after 10 minutes",
});
app.use(limiter);

// Routes
app.use("/api/auth", AuthRouter);

module.exports = app;
