const express = require('express');

const router = express.Router();

const protect = require('../middlewares/authMiddleware');

const {

  createOrder,

  verifyPayment

} = require('../controllers/paymentController');


// CREATE ORDER
router.post(
  '/create-order',
  protect,
  createOrder
);


// VERIFY PAYMENT
router.post(
  '/verify-payment',
  protect,
  verifyPayment
);


module.exports = router;