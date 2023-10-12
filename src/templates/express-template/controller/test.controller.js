"use strict";

const { getTestHelper, putTestHelper, postTestHelper, deleteTestHelper } = require("../helper/test.helper");
const { responseError, responseSucess } = require("../shared/common.shared");
const { status_codes_msg } = require("../shared/static.shared");

exports.getTestController = async (req, res) => {
  try {
    const data = getTestHelper();
    responseSucess(res, status_codes_msg.SUCESS, data);
  } catch (error) {
    responseError(res, error);
  };
};

exports.putTestController = async (req, res) => {
  try {
    const data = putTestHelper();
    responseSucess(res, status_codes_msg.SUCESS, data);
  } catch (error) {
    responseError(res, error);
  };
};

exports.postTestController = async (req, res) => {
  try {
    const data = postTestHelper();
    responseSucess(res, status_codes_msg.SUCESS, data);
  } catch (error) {
    responseError(res, error);
  };
};

exports.deleteTestController = async (req, res) => {
  try {
    const data = deleteTestHelper();
    responseSucess(res, status_codes_msg.SUCESS, data);
  } catch (error) {
    responseError(res, error);
  };
};