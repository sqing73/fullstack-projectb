const ApiError = require("../errors/ApiError");
const EmployeeModel = require("../models/employee");
const HrModel = require("../models/hr");
const RegistrationModel = require("../models/registration");
const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");

const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingEmployee = await EmployeeModel.findOne({
      username,
    });
    if (!existingEmployee) {
      return next();
    }

    const isPasswordCorrect = password === existingEmployee.password;
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid password");
    }

    existingEmployee.status = "active";
    await existingEmployee.save();

    const payload = {
      _id: existingEmployee._id,
    };

    const expirationTime = process.env.JWT_EXPIRATION;
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: expirationTime,
    });

    await existingEmployee.populate("profile");

    return res.status(200).json({
      token,
      user: {
        _id: existingEmployee._id,
        username: existingEmployee.username,
        email: existingEmployee.email,
        role: "employee",
        profile: existingEmployee.profile,
      },
      tokenUpdatedAt: new Date().toLocaleString(),
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    req.user.status = "inactive";
    await req.user.save();
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { username, registrationId, token, password } = req.body;
    if (!isValidObjectId(registrationId)) {
      throw new ApiError(404, "Registration is not found");
    }
    const registration = await RegistrationModel.findById(registrationId);
    if (!registration || registration.status === "inactive") {
      throw new ApiError(404, "Registration is not found");
    }

    const expirationTime = +process.env.TOKEN_EXPIRATION || 3;
    const creationTime = new Date(registration.createdAt);
    const expired =
      creationTime.getTime() + expirationTime * 60 * 60 * 1000 < Date.now();
    if (expired) {
      throw new ApiError(400, "Registration expired, please contact hr");
    }

    const tokenCorrect = token === registration.token;
    if (!tokenCorrect) {
      throw new ApiError(400, "Invalid registraion token");
    }

    let existingHr = await HrModel.findOne({
      username,
    });
    if (existingHr) {
      throw new ApiError(
        400,
        "Username already used, please use another username"
      );
    }

    let existingEmployee = await EmployeeModel.findOne({
      $or: [
        {
          email: registration.email,
        },
        {
          username: username,
        },
      ],
    });
    if (existingEmployee) {
      const duplicateEmail = existingEmployee.email === registration.email;
      if (duplicateEmail) {
        throw new ApiError(400, "Employee alreay exists, please contact hr");
      }
      const duplicateUsername = existingEmployee.username === username;
      if (duplicateUsername) {
        throw new ApiError(
          400,
          "Username already used, please use another username"
        );
      }
    }

    registration.status = "inactive";
    await registration.save();

    let newEmployee = new EmployeeModel({
      username,
      password,
      email: registration.email,
    });

    await newEmployee.save();
    res.status(200).json({
      message: "Employee signup successful",
      employee: {
        _id: newEmployee._id,
        email: newEmployee.email,
        username: newEmployee.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    await req.user.populate("profile");
    res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: "employee",
      profile: req.user.profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signin, logout, signup, getEmployee };
