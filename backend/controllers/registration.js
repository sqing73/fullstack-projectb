const { validationResult } = require("express-validator");
const ApiError = require("../errors/ApiError");
const RegistraionModel = require("../models/registration");
const generateRandomString = require("../utils/randomString");

const addRegistration = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const formattedErrors = validationErrors.array().reduce((acc, err) => {
        return err.msg + " ";
      }, "");
      throw new ApiError(400, formattedErrors);
    }
    const { email, name } = req.body;
    const existingRegistration = await RegistraionModel.findOne({
      email,
    });
    if (existingRegistration) {
      throw new ApiError(400, "Email already exists");
    }

    const newRegistration = new RegistraionModel({
      email,
      name,
      token: generateRandomString(4),
      status: "active",
    });
    await newRegistration.save();
    if (newRegistration.isNew) {
      throw new ApiError("Registration already exists");
    }
    res.status(201).json({
      message: "Registration added successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addRegistration };
