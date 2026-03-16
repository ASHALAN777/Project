const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
require("./Models/db");
require("./middleware/Cronjob");
// const mongoSanitize = require("express-mongo-sanitize");

const helmet = require("helmet");


const AuthRouter = require("./Routes/Router");

const app = express();
const PORT = process.env.PORT || 3001;

const frontendURL = process.env.frontend_url || "http://localhost:5173";

// CORS FIRST
app.use(
  cors({
    origin: frontendURL, // EXACT frontend URL
    credentials: true,               // allow cookies
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

//  THEN parsers
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());






  //  THEN rate limiter
  const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,                 // max requests per IP
  message: "Too many requests, try again after 10 seconds",
});

app.use(limiter);






// //  THEN routes
app.use("/api/auth", AuthRouter);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


