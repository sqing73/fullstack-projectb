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
  },
  {
    versionKey: false,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
