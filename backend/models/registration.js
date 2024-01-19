const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    employeeName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
    },
  },
  {
    versionKey: false,
  }
);

const Registraion = mongoose.model("Registration", registrationSchema);

module.exports = Registraion;
