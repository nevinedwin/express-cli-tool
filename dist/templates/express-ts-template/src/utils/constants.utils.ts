export default  {
  status_codes_msg: {
    SUCESS: {
      code: 200,
      message: `SUCCESS`,
    },
    CREATED: {
      code: 200,
      message: "Created Successfully",
    },
    UPDATE_FAILED: {
      code: 302,
      message: `Update Failed`,
    },
    BAD_REQUEST: {
      code: 400,
      message: `Request contains invalid or incomplete data.`,
    },
    FILE_REQUIRED: {
      code: 400,
      message: `FILE Required`,
    },
    IMAGE_REQUIRED: {
      code: 400,
      message: `Image Required`,
    },
    EVENT_REQUIRED: {
      code: 400,
      message: `Event Required`,
    },
    ENV_REQUIRED: {
      code: 400,
      message: `Environment Variables Required`,
    },
    EMPTY_UPDATE: {
      code: 400,
      message: `Nothing to update`,
    },
    CONTEXT_REQUIRED: {
      code: 400,
      message: `Context Required`,
    },
    NOT_AUTHORIZED: {
      code: 401,
      message: "The request for this resource is not authorized.",
    },
    JWT_TOKEN_EXPIRED_AUTH: {
      code: 401,
      message: "TOKEN_EXPIRED",
    },
    INVALID_TOKEN_AUTH: {
      code: 403,
      message: "Invalid_TOKEN",
    },
    JWT_TOKEN_EXPIRED_REFRESH: {
      code: 403,
      message: "TOKEN_EXPIRED",
    },
    AUTH_CREATION_FAILED: {
      code: 403,
      message: "TOKEN creation failed",
    },
    INVALID_TOKEN_REFRESH: {
      code: 403,
      message: "Invalid TOKEN",
    },
    API_NOT_FOUND: {
      code: 404,
      message: `The request entity for this api is not found.`,
    },
    NO_RECORD_FOUND: {
      code: 404,
      message: `Data Not Found.`,
    },
    DATA_CONFLICT: {
      code: 409,
      message: `Data Conflict`,
    },
    OTP_EXPIRED: {
      code: 410,
      message: `OTP expired`,
    },
    EMAIL_EXIST: {
      code: 422,
      message: "Email Already Exists",
    },
    INVALID_ENTITY: {
      code: 422,
      message: "Invalid Entity",
    },
    ENTITY_ALREADY_EXIT: {
      code: 422,
      message: "Entity already exist",
    },
    MOB_EXIST: {
      code: 422,
      message: "MobileNumber Already Exists",
    },
    WRONG_DATA: {
      code: 422,
      message: "Already Exists",
    },
    ACCOUNT_LOCKED: {
      code: 423,
      message: "Sorry your Account is locked, Please reset your password.",
    },
    EMAIL_SENDFAILED: {
      code: 424,
      message: "Failed Dependency Send Failure",
    },
    INTERNAL_ERROR: {
      code: 500,
      message: `Internal error occurred while processing the request`,
    },
    CREATION_FAILED: {
      code: 302,
      message: `Creation Failed`,
    },
    NOT_COMPLETE: {
      code: 302,
      message: `Not Complete`,
    },
    DELETE_FAILED: {
      code: 404,
      message: `Resource Does not exists`,
    },
  },
  STRINGS: {
    ACCOUNT_LOCKED: `Sorry your Account is locked, Please reset your password.`,
    ACCOUNT_SUSPEND: `Sorry your Account is blocked, Please contact the  support team.`,
    ALREADY_EXIST: `Already Exist`,
    ACCOUNT_REG: `Account Created Successfully Please Verify your email`,
    CREATED_SUCCESS: `Created Successfully`,
    DELETED: "Resource deleted.",
    DELETE_ERROR: "Error Removing.",
    EMAIL_VALIDATE: `Email is not valid.`,
    EMPTY_EVENT: `Event is null or empty`,
    EMPTY_CONTEXT: `Context is null or empty`,
    EMAIL_SEND_SUCCESS: `Email send successfully`,
    GENERATED_SUCCESS: `Generated Successfully`,
    LOGIN_SUCCESS: "Login Successfully.",
    LOGOUT_SUCCESS: "Logout Successfully.",
    IMAGE_UPLOAD: `Upload an Image`,
    INVALID_OTP: `Invalid OTP`,
    INVALID_LOGIN: `Invalid Credentials`,
    INVALID_MOBILENO: `Mobile Number is not valid.`,
    INVALID_DATA: `is not valid.`,
    NOT_REGISTER: "User not registerd.",
    NOT_EXIST: "Resource does not exist.",
    NOT_VERIFIED: "Sorry your account is not verified.",
    NULL_DATA: "Null Data",
    OOPS: `Oops Something went wrong`,
    OTP_EXPIRED: `OTP expired`,
    OTP_FAILED: `OTP sent failed`,
    OTP_SEND_SUCCESS: `OTP sent successfully`,
    OTP_VERIFIED_SUCCESS: `OTP verified successfully`,
    OTP_VERIFIED_FAIL: `OTP verification failed`,
    REGISTER_SUCCESS: `Registration successfully`,
    TOKEN_GENERATE: `Token Generated Successfully`,
    USER_NOT_EXIST: "User does not exist.",
    UPDATE_SUCCESS: "Updated successfully.",
    UPDATE_ERROR: "Error updating.",
  },
}