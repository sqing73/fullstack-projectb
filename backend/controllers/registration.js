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
    const { email, employee } = req.body;
    const existingRegistration = await RegistraionModel.findOne({
      email,
    });
    if (existingRegistration) {
      throw new ApiError(400, "Email already exists");
    }

    const newRegistration = new RegistraionModel({
      email,
      employeeName: employee,
      token: generateRandomString(4),
      status: "active",
    });
    await newRegistration.save();
    if (newRegistration.isNew) {
      throw new ApiError("Registration already exists");
    }
    const emailContent = `<p>Link: ${process.env.CLIENT_URL}/registration/${newRegistration._id}</p>
    <p>Token: ${newRegistration.token}</p>
    <p>This token is valid for 3 hours till <b>${newRegistration.createdAt}.</b></p>`;
    await sendEmail(email, emailContent);
    res.status(201).json({
      message: `Registration created successfully and an invitation was sent to ${email}.`,
      registration: {
        _id: newRegistration._id,
        email: newRegistration.email,
        employee: newRegistration.employeeName,
        status: newRegistration.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRegistrationById = async (req, res, next) => {
  try {
    const { registrationId, token } = req.body;
    const registration = await RegistraionModel.findById(registrationId);
    if (!registration || registration.status === "inactive") {
      throw new ApiError(404, "Registration is not found");
    }

    const creationTime = new Date(registration.createdAt);
    const expired = creationTime.getTime() + 3 * 60 * 60 * 1000 < Date.now();
    if (expired) {
      throw new ApiError(400, "Registration expired, please contact hr");
    }
    let resMessage;
    if (token !== undefined) {
      const tokenCorrect = token === registration.token;
      if (!tokenCorrect) {
        throw new ApiError(400, "Invalid registraion token");
      } else {
        resMessage = "Registration token correct";
      }
    }

    res.status(200).json({
      message: resMessage,
      registration: {
        _id: registration._id,
        email: registration.email,
        createdAt: registration.createdAt,
        employeeName: registration.employeenName,
        status: registration.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addRegistration, getRegistrationById };
