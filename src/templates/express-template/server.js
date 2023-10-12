"use strict";

const express = require('express');
const compression = require("compression");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { responseError } = require('./shared/common.shared');
const { status_codes_msg } = require('./shared/static.shared');


const app = express();

const port = process.env.PORT || 8081;

app.use(
  express.json({
    limit: "50kb",
    extended: false,
    parameterLimit: 50000,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(hpp());
app.use(helmet());


const whitelist = [
  "http://localhost:3000/*",
  "*://192.168.*.*",
];

const corsOption = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Origin Not Allowed by CORS"));
    };
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};

const limit = rateLimit({
  max: 1000, // max requests
  windowMs: 5 * 60 * 1000, // 5 min
  message: "Too many requests",
});

app.use("/api", cors(corsOption), limit, require("./router/index.router"));

/* to handle the not found apis*/
app.use("/", (req, res, next) => {
  console.log({ path: req?._parsedUrl });
  responseError(res, status_codes_msg.API_NOT_FOUND);
});

/* to handle the error*/
app.use((err, req, res, next) => {
  if (!err) {
    return next;
  };
  responseError(res, new Error(err));
});


/* to handle the unhandledRejection from the nodejs*/
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});


// listening to the PORT
app.listen(port, () => {
  console.log(`🚀 app running on port: ${port} 🚀`);
});