const express = require('express');

const router = express.Router();

// ======================================
// AUTH MIDDLEWARE
// ======================================

const {

  protect

} = require(
  '../middlewares/authMiddleware'
);

// ======================================
// CONTROLLERS
// ======================================

const {

  createOrder,

  verifyPayment

} = require(
  '../controllers/paymentController'
);

// ======================================
// CREATE ORDER
// ======================================

router.post(

  '/create-order',

  protect,

  createOrder

);

// ======================================
// VERIFY PAYMENT
// ======================================

router.post(

  '/verify-payment',

  protect,

  verifyPayment

);

// ======================================
// EXPORT
// ======================================

module.exports = router;