const express = require('express');

const router = express.Router();

const {
  login,
  register,
  verifyOtp
} = require('../controllers/authController');


// LOGIN ROUTE
router.post('/login', login);


// REGISTER ROUTE
router.post('/register', register);


// VERIFY OTP ROUTE
router.post('/verify-otp', verifyOtp);


module.exports = router;