"use strict";

import { getTestHelper, putTestHelper, postTestHelper, deleteTestHelper } from '../helper/test.helper.js';
import { failure, success } from '../utils/common.utils.js';
import constant from "../utils/constants.utils.js";

import { Request, Response } from 'express';

const { status_codes_msg } = constant;


export const getTestController = async (req: Request, res: Response) => {
  try {
    const data = getTestHelper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};

export const putTestController = async (req: Request, res: Response) => {
  try {
    const data = putTestHelper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};

export const postTestController = async (req: Request, res: Response) => {
  try {
    const data = postTestHelper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};

export const deleteTestController = async (req: Request, res: Response) => {
  try {
    const data = deleteTestHelper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};