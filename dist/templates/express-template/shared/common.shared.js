const { STRINGS, status_codes_msg } = require("./static.shared");

// for returning the success response
const responseSucess = (
  res,
  message = status_codes_msg.SUCESS.message,
  data
) => {
  return res
    .status(200)
    .json({ message, data });
};

//for returning the error response
const responseError = (res, err, attempts) => {
  return res.status(err?.code || 500).json({
    message: err?.message || err || STRINGS.OOPS,
    attempts,
  });
};


module.exports = {
  responseSucess,
  responseError
};