const express = require("express");
const router = express.Router();

const {
  getStudentProfile,
  getMyCourses,
  getCourseProgress,
  getAssessmentStatus,
  getCertificates,
} = require("../controllers/studentController");

const authMiddleware = require("../middlewares/authMiddleware");

// Protected Routes
router.get("/profile", authMiddleware, getStudentProfile);

router.get("/my-courses", authMiddleware, getMyCourses);

router.get("/course-progress", authMiddleware, getCourseProgress);

router.get("/assessment-status", authMiddleware, getAssessmentStatus);

router.get("/certificates", authMiddleware, getCertificates);

module.exports = router;