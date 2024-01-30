const ApiError = require("../errors/ApiError");
const HrModel = require("../models/hr");
const jwt = require("jsonwebtoken");
const EmployeeProfile = require("../models/employeeProfile");

const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingHr = await HrModel.findOne({
      username: { $eq: username },
    });
    if (!existingHr) {
      throw new ApiError(404, "Username does not exist");
    }

    const isPasswordCorrect = password === existingHr.password;
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid password");
    }

    existingHr.status = "active";
    await existingHr.save();

    const payload = {
      _id: existingHr._id,
    };

    const expirationTime = process.env.JWT_EXPIRATION;
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: expirationTime,
    });

    return res.status(200).json({
      token,
      user: {
        _id: existingHr._id,
        username: existingHr.username,
        role: "hr",
      },
      tokenUpdatedAt: new Date().toLocaleString(),
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve a specific employee's visa details
const getEmployeeProfile = async (req, res) => {
  try {
    const profile = await EmployeeProfile.findById(req.params.id).select(
      "-visaStatus -visaCurrStep"
    );
    if (!profile) {
      return res.status(404).send("Employee profile not found");
    }
    res.json(profile);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Modify an existing employee's visa record
const modifyEmployeeProfile = async (req, res) => {
  try {
    const updates = {
      ...req.body,
    };
    const updatedProfile = await EmployeeProfile.findByIdAndUpdate(
      updates._id,
      updates,
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).send("Employer not found");
    }
    res.json(updatedProfile); // Send back the updated profile
  } catch (error) {
    res.status(500).send(error.message);
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

module.exports = { signin, logout, getEmployeeProfile, modifyEmployeeProfile };
