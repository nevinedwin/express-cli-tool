import constant from "./constants.utils.js";
const { STRINGS, status_codes_msg } = constant;

import { Response } from 'express';

// for returning the success response
export const success = (
  res: Response,
  message = status_codes_msg.SUCESS.message,
  data: any
) => {
  return res
    .status(200)
    .json({ message, data });
};

//for returning the error response
export const failure = (res: Response, err: any, attempts?: any) => {
  return res.status(err?.code || 500).json({
    message: err?.message || err || STRINGS.OOPS,
    attempts,
  });
};


