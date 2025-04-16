const User = require("../models/userModel");
const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const registerUser = AsyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  // Check if user already exists
  const checkUser = await User.findOne({ email });
  if (checkUser) {
    res.status(400);
    throw new Error("User already exists!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const createdUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
  });

  res.json({
    email,
    role,
    token: generateToken(createdUser._id),
  });
});

const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter the fields");
  }
  const findUser = await User.findOne({ email });
  if (!findUser) {
    res.status(404);
    throw new Error("User not found");
  }
  if (await bcrypt.compare(password, findUser.password)) {
    res.status(200).json({
      _id: findUser._id,
      email: findUser.email,
      role: findUser.role,
      token: generateToken(findUser._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
});

const forgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset Request",
    text: `Click the link to reset your password: ${resetLink}`,
  });

  res.json({ message: "Password reset email sent" });
});

const resetPassword = AsyncHandler(async (req, res) => {
  const { token, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = "";
  user.resetPasswordExpires = null;
  await user.save();

  res.json({ message: "Password reset successful" });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
