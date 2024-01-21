const jwt = require("jsonwebtoken");
const HrModel = require("../models/hr");
const EmployeeModel = require("../models/employee");
const ApiEror = require("../errors/ApiError");

const requireHrAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new ApiEror(401, "Unauthorized");
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hr = await HrModel.findById(decoded._id);

    if (hr && hr.status === "active") {
      req.user = hr;
      next();
    } else {
      throw new ApiEror(401, "Unauthorized");
    }
  } catch (error) {
    next(error);
  }
};

const requireEmployeeAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new ApiEror(401, "Unauthorized");
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const employee = await EmployeeModel.findById(decoded._id);

    if (employee && employee.status === "active") {
      req.user = employee;
      next();
    } else {
      throw new ApiEror(401, "Unauthorized");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { requireHrAuth, requireEmployeeAuth };
