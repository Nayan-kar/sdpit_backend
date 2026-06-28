
// routes/authRoutes.js

const express =
  require("express");

const router =
  express.Router();

const {

  login,

  register,

  verifyOtp,

  resendOtp,

  getMe,

  forgotPassword,

  resetPassword,

} = require(
  "../controllers/authController"
);

const { protect } = require("../middlewares/authMiddleware");

// =====================================
// LOGIN
// =====================================

router.post(
  "/login",
  login
);

// =====================================
// REGISTER
// =====================================

router.post(
  "/register",
  register
);

// =====================================
// VERIFY OTP
// =====================================

router.post(
  "/verify-otp",
  verifyOtp
);

// =====================================
// RESEND OTP
// =====================================

router.post(
  "/resend-otp",
  resendOtp
);

// =====================================
// GET CURRENT USER PROFILE (/me)
// =====================================

router.get(
  "/me",
  protect,
  getMe
);

// =====================================
// FORGOT PASSWORD
// =====================================

router.post(
  "/forgot-password",
  forgotPassword
);

// =====================================
// RESET PASSWORD
// =====================================

router.post(
  "/reset-password/:token",
  resetPassword
);

module.exports =
  router;

