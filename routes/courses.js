const express = require('express');

const router = express.Router();

const protect = require('../middlewares/authMiddleware');

const adminMiddleware = require('../middlewares/adminMiddleware');

const upload = require('../middlewares/upload');

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
  protect,
  adminMiddleware,
  upload.single('thumbnail'),
  createCourse
);


// UPDATE COURSE
router.put(
  '/:id',
  protect,
  adminMiddleware,
  upload.single('thumbnail'),
  updateCourse
);


// DELETE COURSE
router.delete(
  '/:id',
  protect,
  adminMiddleware,
  deleteCourse
);


module.exports = router;