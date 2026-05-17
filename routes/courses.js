const express = require('express');

const router = express.Router();

const {

  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse

} = require('../controllers/courseController');

const auth = require('../middleware/auth');

// GET ALL COURSES
router.get('/', auth, getCourses);

// GET SINGLE COURSE
router.get('/:id', auth, getCourseById);

// CREATE COURSE
router.post('/', auth, createCourse);

// UPDATE COURSE
router.put('/:id', auth, updateCourse);

// DELETE COURSE
router.delete('/:id', auth, deleteCourse);

module.exports = router;