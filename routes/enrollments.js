const express = require('express');

const router = express.Router();

const protect = require('../middlewares/authMiddleware');

const {

  enrollFreeCourse,
  getMyCourses

} = require('../controllers/enrollmentController');


// ENROLL FREE COURSE
router.post(
  '/free-enroll',
  protect,
  enrollFreeCourse
);


// GET MY COURSES
router.get(
  '/my-courses',
  protect,
  getMyCourses
);


module.exports = router;