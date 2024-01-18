const { validationResult } = require("express-validator");
const ApiError = require("../errors/ApiError");
const RegistraionModel = require("../models/registration");
const generateRandomString = require("../utils/randomString");
const sendEmail = require("../utils/sendEmail");

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
    const emailContent = `Link: ${process.env.CLIENT_URL}/registration/${newRegistration._id}\nToken: ${newRegistration.token}`;
    await sendEmail(email, emailContent);
    res.status(201).json({
      message: `Registration added successfully and an invitation was sent to ${email}.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addRegistration };
