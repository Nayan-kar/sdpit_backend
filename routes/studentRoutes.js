const express = require("express");

const router = express.Router();

// ======================================
// CONTROLLERS
// ======================================

const {

  getStudentProfile,

  getMyCourses,

  getCourseProgress,

  getAssessmentStatus,

  getCertificates,

} = require(
  "../controllers/studentController"
);

// ======================================
// AUTH MIDDLEWARE
// ======================================

const {

  protect

} = require(
  "../middlewares/authMiddleware"
);

// ======================================
// STUDENT PROFILE
// ======================================

router.get(

  "/profile",

  protect,

  getStudentProfile

);

// ======================================
// MY COURSES
// ======================================

router.get(

  "/my-courses",

  protect,

  getMyCourses

);

// ======================================
// COURSE PROGRESS
// ======================================

router.get(

  "/course-progress",

  protect,

  getCourseProgress

);

// ======================================
// ASSESSMENT STATUS
// ======================================

router.get(

  "/assessment-status",

  protect,

  getAssessmentStatus

);

// ======================================
// CERTIFICATES
// ======================================

router.get(

  "/certificates",

  protect,

  getCertificates

);

// ======================================
// EXPORT
// ======================================

module.exports = router;