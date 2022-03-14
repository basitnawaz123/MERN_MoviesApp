const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    phone: {
      type: String,
      required: [true, "Please add a phone"],
      unique: [true, "Phone already exists!"],
    },
    email: {
      type: String,
      required: [true, "Please add a Email"],
      unique: [true, "Email already exists!"],
    },
    password: {
      type: String,
      required: [true, "Please add a Password"],
    },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    reset_token: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = users = mongoose.model("users", userSchema);
