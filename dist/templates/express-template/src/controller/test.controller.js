"use strict";

const { getTestHelper, putTestHelper, postTestHelper, deleteTestHelper } = require("../helper/test.helper");
const { failure, success } = require("../utils/common.utils");
const { status_codes_msg } = require("../utils/constants.utils");

exports.getTestController = async (req, res) => {
  try {
    const data = getTestHelper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};

exports.putTestController = async (req, res) => {
  try {
    const data = putTestHelper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};

exports.postTestController = async (req, res) => {
  try {
    const data = postTestHelper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};

exports.deleteTestController = async (req, res) => {
  try {
    const data = deleteTestHelper();
    success(res, status_codes_msg.SUCESS.message, data);
  } catch (error) {
    failure(res, error);
  };
};