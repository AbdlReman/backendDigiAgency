const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please enter full name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
  },
  role: {
    type: String,
    // enum: ["admin", "User"],
    default: "User",
  },
  resetPasswordToken: {
    type: String,
    default: "",
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
