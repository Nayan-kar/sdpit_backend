const express = require('express');

const router = express.Router();

// ======================================
// AUTH MIDDLEWARE
// ======================================

const {

  protect,

  authorizeRoles

} = require(
  '../middlewares/authMiddleware'
);

// ======================================
// FILE UPLOAD MIDDLEWARE
// ======================================

const upload = require(
  '../middlewares/upload'
);

// ======================================
// CONTROLLERS
// ======================================

const {

  getCourses,

  getCourseById,

  createCourse,

  updateCourse,

  deleteCourse

} = require(
  '../controllers/courseController'
);

// ======================================
// GET ALL COURSES
// ======================================

router.get(

  '/',

  getCourses

);

// ======================================
// GET SINGLE COURSE
// ======================================

router.get(

  '/:id',

  getCourseById

);

// ======================================
// CREATE COURSE
// ======================================

router.post(

  '/',

  protect,

  authorizeRoles('admin'),

  upload.single('thumbnail'),

  createCourse

);

// ======================================
// UPDATE COURSE
// ======================================

router.put(

  '/:id',

  protect,

  authorizeRoles('admin'),

  upload.single('thumbnail'),

  updateCourse

);

// ======================================
// DELETE COURSE
// ======================================

router.delete(

  '/:id',

  protect,

  authorizeRoles('admin'),

  deleteCourse

);

// ======================================
// EXPORT
// ======================================

module.exports = router;