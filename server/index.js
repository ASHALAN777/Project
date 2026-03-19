const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
require("./Models/db");
const helmet = require("helmet");
const AuthRouter = require("./Routes/Router");

const app = express();

const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173" ,"https://usermanagement-lemon.vercel.app" ;

// CORS first
app.use(
  cors({
    origin: function (origin, callback) {
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

// Manual mongo sanitizer (replaces express-mongo-sanitize which breaks on Node 24)
app.use((req, res, next) => {
  if (req.body) {
    const sanitize = (obj) => {
      for (let key in obj) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          sanitize(obj[key]);
        }
      }
    };
    sanitize(req.body);
  }
  next();
});

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again after 10 minutes",
});
app.use(limiter);

// Routes
app.use("/api/auth", AuthRouter);

// Export for Vercel serverless
module.exports = app;
