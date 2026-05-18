const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const {

  enrollFreeCourse,
  getMyCourses

} = require('../controllers/enrollmentController');

// ENROLL FREE COURSE
router.post('/free-enroll', auth, enrollFreeCourse);

// GET MY COURSES
router.get('/my-courses', auth, getMyCourses);

module.exports = router;