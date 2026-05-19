const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const upload = require('../middleware/upload');

const {

  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse

} = require('../controllers/courseController');

// GET ALL COURSES
router.get('/', getCourses);

// GET SINGLE COURSE
router.get('/:id', getCourseById);

// CREATE COURSE
router.post(
  '/',
  auth,
  upload.single('image'),
  createCourse
);

// UPDATE COURSE
router.put(
  '/:id',
  auth,
  upload.single('image'),
  updateCourse
);

// DELETE COURSE
router.delete(
  '/:id',
  auth,
  deleteCourse
);

module.exports = router;