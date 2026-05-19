const Razorpay = require('razorpay');

const crypto = require('crypto');

const Course = require('../models/Course');

const Enrollment = require('../models/Enrollment');

// RAZORPAY INSTANCE
const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_KEY_SECRET

});

// CREATE ORDER
const createOrder = async (req, res) => {

  try {

    const { courseId } = req.body;

    const userId = req.user.id;

    // VALIDATE COURSE
    const course = await Course.findById(courseId);

    if (!course) {

      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });

    }

    // CHECK IF COURSE IS PAID
    if (!course.isPaid) {

      return res.status(400).json({
        success: false,
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
        success: false,
        message: 'Already enrolled in this course'
      });

    }

    // CREATE RAZORPAY ORDER
    const options = {

      amount: Number(course.price) * 100,

      currency: 'INR',

      receipt: `receipt_${Date.now()}`,

      payment_capture: 1

    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({

      success: true,

      order,

      course

    });

  } catch (error) {

    console.log('CREATE ORDER ERROR:', error);

    res.status(500).json({

      success: false,

      message: 'Failed to create order'

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

    // GENERATE SIGNATURE
    const body =

      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(

        'sha256',

        process.env.RAZORPAY_KEY_SECRET

      )
      .update(body.toString())
      .digest('hex');

    // VERIFY SIGNATURE
    if (expectedSignature !== razorpay_signature) {

      return res.status(400).json({

        success: false,

        message: 'Invalid payment signature'

      });

    }

    // FIND COURSE
    const course = await Course.findById(courseId);

    if (!course) {

      return res.status(404).json({

        success: false,

        message: 'Course not found'

      });

    }

    // CHECK EXISTING ENROLLMENT AGAIN
    const existingEnrollment =
      await Enrollment.findOne({

        userId,

        courseId,

        expiryDate: { $gt: new Date() }

      });

    if (existingEnrollment) {

      return res.status(400).json({

        success: false,

        message: 'Already enrolled'

      });

    }

    // CREATE EXPIRY DATE
    const expiryDate = new Date();

    expiryDate.setDate(

      expiryDate.getDate() +
      course.duration

    );

    // SAVE ENROLLMENT
    await Enrollment.create({

      userId,

      courseId,

      expiryDate,

      paymentStatus: 'paid',

      razorpay_order_id,

      razorpay_payment_id

    });

    res.status(200).json({

      success: true,

      message: 'Payment verified successfully'

    });

  } catch (error) {

    console.log('VERIFY PAYMENT ERROR:', error);

    res.status(500).json({

      success: false,

      message: 'Payment verification failed'

    });

  }

};

module.exports = {

  createOrder,

  verifyPayment

};