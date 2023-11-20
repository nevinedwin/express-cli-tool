import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';

import indexRouter from './router/index.router.js';
import { failure } from './utils/common.utils.js';
import constant from "./utils/constants.utils.js";
import compression from 'compression';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

import { JsonMiddlewareOptionType } from './utils/types.utils.js';

const { status_codes_msg } = constant;

const app = express();

const port: string | number = process.env.PORT || 8081;

const jsonMiddlewareOption: JsonMiddlewareOptionType = {
  limit: "50kb",
  extended: false,
  parameterLimit: 50000,
}

app.use(express.json(jsonMiddlewareOption));

app.use(compression());
app.use(cookieParser());
app.use(hpp());
app.use(helmet());


const whitelist: Array<string> = [
  "http://localhost:3000/*",
  "*://192.168.*.*",
];

const corsOption = {
  origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
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


app.use('/api', cors(corsOption), limit, indexRouter);


/* to handle the not found apis*/
app.use("/", (req: Request, res: Response, next: NextFunction) => {
  failure(res, status_codes_msg.API_NOT_FOUND);
});

/* to handle the error*/
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    return next;
  };
  const errorInstance = err instanceof Error ? err : new Error(err);
  failure(res, errorInstance);
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



app.listen(port, () => {
  console.log(`🚀 app running on port: ${port}`);
});