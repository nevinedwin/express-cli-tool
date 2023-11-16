const { STRINGS, status_codes_msg } = require("./constants.utils");

// for returning the success response
const success = (
  res,
  message = status_codes_msg.SUCESS.message,
  data
) => {
  return res
    .status(200)
    .json({ message, data });
};

//for returning the error response
const failure = (res, err, attempts) => {
  return res.status(err?.code || 500).json({
    message: err?.message || err || STRINGS.OOPS,
    attempts,
  });
};


module.exports = {
  success,
  failure
};