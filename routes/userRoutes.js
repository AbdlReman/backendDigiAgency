const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
