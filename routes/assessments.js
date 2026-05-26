const express = require("express");

const router = express.Router();

// ======================================
// CONTROLLERS
// ======================================

const {
    createAssessment,
    addQuestion,
    getAssessmentQuestions,
    startAssessment,
    submitAssessment
} = require("../controllers/assessmentController");

// ======================================
// MIDDLEWARES
// ======================================

const protect =
    require("../middlewares/authMiddleware");

const adminMiddleware =
    require("../middlewares/adminMiddleware");


// ======================================
// ADMIN ROUTES
// ======================================

// CREATE ASSESSMENT
router.post(
    "/create",
    protect,
    adminMiddleware,
    createAssessment
);

// ADD QUESTION
router.post(
    "/add-question",
    protect,
    adminMiddleware,
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

module.exports = router;