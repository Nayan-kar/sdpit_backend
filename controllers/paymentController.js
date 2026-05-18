const Razorpay = require('razorpay');

const crypto = require('crypto');

const Course = require('../models/Course');

const Enrollment = require('../models/Enrollment');

// RAZORPAY INSTANCE
const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_SECRET

});

// CREATE ORDER
const createOrder = async (req, res) => {

  try {

    const { courseId } = req.body;

    const userId = req.user.id;

    // FIND COURSE
    const course = await Course.findById(courseId);

    if (!course) {

      return res.status(404).json({
        message: 'Course not found'
      });

    }

    // CHECK PAID COURSE
    if (!course.isPaid) {

      return res.status(400).json({
        message: 'This is a free course'
      });

    }

    // CHECK EXISTING ENROLLMENT
    const existingEnrollment =
      await Enrollment.findOne({

        userId,

        courseId,

        expiryDate: { $gt: new Date() }

      });

    if (existingEnrollment) {

      return res.status(400).json({
        message: 'Already enrolled'
      });

    }

    // CREATE ORDER
    const options = {

      amount: course.price * 100,

      currency: 'INR',

      receipt: `receipt_${Date.now()}`

    };

    const order = await razorpay.orders.create(
      options
    );

    res.status(200).json({

      order,

      course

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

// VERIFY PAYMENT
const verifyPayment = async (req, res) => {

  try {

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

      courseId

    } = req.body;

    const userId = req.user.id;

    // VERIFY SIGNATURE
    const sign =

      razorpay_order_id +
      '|' +
      razorpay_payment_id;

    const expectedSign = crypto
      .createHmac(

        'sha256',

        process.env.RAZORPAY_SECRET

      )
      .update(sign.toString())
      .digest('hex');

    // INVALID SIGNATURE
    if (razorpay_signature !== expectedSign) {

      return res.status(400).json({

        message: 'Invalid payment signature'

      });

    }

    // FIND COURSE
    const course = await Course.findById(
      courseId
    );

    if (!course) {

      return res.status(404).json({
        message: 'Course not found'
      });

    }

    // EXPIRY DATE
    const expiryDate = new Date();

    expiryDate.setDate(

      expiryDate.getDate() +
      course.duration

    );

    // CREATE ENROLLMENT
    await Enrollment.create({

      userId,

      courseId,

      expiryDate,

      paymentStatus: 'paid'

    });

    res.status(200).json({

      success: true,

      message: 'Payment successful'

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

module.exports = {

  createOrder,

  verifyPayment

};