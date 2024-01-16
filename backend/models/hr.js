const mongoose = require("mongoose");

const hrSchema = new mongoose.Schema(
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
      enum: ["active", "inactive"],
    },
  },
  {
    versionKey: false,
  }
);

const Hr = mongoose.model("Hr", hrSchema);

module.exports = Hr;
