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

  enrollFreeCourse,

  getMyCourses

} = require(
  '../controllers/enrollmentController'
);

// ======================================
// ENROLL FREE COURSE
// ======================================

router.post(

  '/free-enroll',

  protect,

  enrollFreeCourse

);

// ======================================
// GET MY COURSES
// ======================================

router.get(

  '/my-courses',

  protect,

  getMyCourses

);

// ======================================
// EXPORT
// ======================================

module.exports = router;