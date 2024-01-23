const { validationResult } = require("express-validator");
const ApiError = require("../errors/ApiError");
const RegistraionModel = require("../models/registration");
const EmployeeModel = require("../models/employee");
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
      throw new ApiError(400, "Email already exists in registrations");
    }

    const existingEmployee = await EmployeeModel.findOne({
      email,
    });
    if (existingEmployee) {
      throw new ApiError(400, "Email already exists in employees");
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
    const link = `${process.env.CLIENT_URL}/register/${newRegistration._id}`;
    const emailContent = `<h2>Hi, ${employee}</h2>
    <p>Please use the link and token below to register your employee account and complete onboarding application</p>
    <p>link: <a href="${link}">${link}</a></p>
    <p>Token: ${newRegistration.token}</p>
    <p>This token is valid for 3 hours till <b>${newRegistration.createdAt}.</b></p>`;
    await sendEmail(email, emailContent);
    res.status(201).json({
      message: `Registration created successfully and an invitation was sent to ${email}.`,
      registration: {
        _id: newRegistration._id,
        email: newRegistration.email,
        employeeName: newRegistration.employeeName,
        status: newRegistration.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRegistrationById = async (req, res, next) => {
  try {
    const { registrationId } = req.body;
    if (!registrationId) {
      const registrations = await RegistraionModel.find({})
        .select("-token")
        .sort({ createdAt: -1 });
      return res.status(200).json({
        registrations,
      });
    }
    const registration = await RegistraionModel.findById(registrationId);

    return res.status(200).json({
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
