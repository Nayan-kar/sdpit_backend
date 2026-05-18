const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({

  userId: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'User',

    required: true

  },

  courseId: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'Course',

    required: true

  },

  enrolledAt: {

    type: Date,

    default: Date.now

  },

  expiryDate: {

    type: Date,

    required: true

  },

  paymentStatus: {

    type: String,

    enum: ['free', 'paid'],

    default: 'free'

  }

}, {

  timestamps: true

});

module.exports = mongoose.model(
  'Enrollment',
  enrollmentSchema
);