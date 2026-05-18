const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const {

  createOrder,

  verifyPayment

} = require('../controllers/paymentController');

// CREATE ORDER
router.post(
  '/create-order',
  auth,
  createOrder
);

// VERIFY PAYMENT
router.post(
  '/verify-payment',
  auth,
  verifyPayment
);

module.exports = router;