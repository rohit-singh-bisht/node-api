const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    gender: {
      type: String,
      require: true,
    },
    job_title: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("user", userSchema);

module.exports = { Users };
