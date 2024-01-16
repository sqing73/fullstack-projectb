const ApiError = require("../errors/ApiError");
const HrModel = require("../models/hr");

const signin = async (req, res, next) => {
  try {
    throw new ApiError(400, "test error");
  } catch (error) {
    next(error);
  }
};

module.exports = { signin };
