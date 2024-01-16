const ApiError = require("../errors/ApiError");
const EmployeeModel = require("../models/employee");
const jwt = require("jsonwebtoken");

const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingEmployee = await EmployeeModel.findOne({
      username: { $eq: username },
    });
    if (!existingEmployee) {
      throw new ApiError(404, "Username does not exist");
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

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      token,
      user: {
        _id: existingEmployee._id,
        username: existingEmployee.username,
        email: existingEmployee.email,
        role: "employee",
      },
      tokenUpdatedAt: new Date().toLocaleString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signin };
