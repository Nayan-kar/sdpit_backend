const express = require("express");

const router = express.Router();

// ======================================
// CONTROLLERS
// ======================================

const {

  getAssessments,

  createAssessment,

  addQuestion,

  getAssessmentQuestions,

  startAssessment,

  submitAssessment

} = require(
  "../controllers/assessmentController"
);

// ======================================
// AUTH MIDDLEWARE
// ======================================

const {

  protect,

  authorizeRoles

} = require(
  "../middlewares/authMiddleware"
);

// ======================================
// GET ALL ASSESSMENTS
// ======================================

router.get(

  "/",

  protect,

  getAssessments

);

// ======================================
// ADMIN ROUTES
// ======================================

// CREATE ASSESSMENT

router.post(

  "/create",

  protect,

  authorizeRoles("admin"),

  createAssessment

);

// ADD QUESTION

router.post(

  "/add-question",

  protect,

  authorizeRoles("admin"),

  addQuestion

);

// ======================================
// STUDENT ROUTES
// ======================================

// GET RANDOMIZED QUESTIONS

router.get(

  "/:assessmentId/questions",

  protect,

  getAssessmentQuestions

);

// START ASSESSMENT

router.post(

  "/start/:assessmentId",

  protect,

  startAssessment

);

// SUBMIT ASSESSMENT

router.post(

  "/submit/:attemptId",

  protect,

  submitAssessment

);

// ======================================
// EXPORT
// ======================================

module.exports = router;