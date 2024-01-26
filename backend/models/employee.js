const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "inactive",
      enum: ["active", "inactive"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeProfile",
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
