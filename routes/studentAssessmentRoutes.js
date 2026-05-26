const express = require('express');

const router = express.Router();

// ========================================
// AUTH MIDDLEWARE
// ========================================

const {

  protect,

  authorizeRoles

} = require('../middlewares/authMiddleware');

// ========================================
// CONTROLLERS
// ========================================

const {

  startAssessment,

  getAssessmentQuestions,

  saveAnswer,

  submitAssessment,

  getResult,

  flagTabSwitch,

  flagFullscreenExit

} = require(

  '../controllers/studentAssessmentController'

);

// ========================================
// START ASSESSMENT
// ========================================

router.post(

  '/start/:assessmentId',

  protect,

  authorizeRoles('student', 'admin'),

  startAssessment

);

// ========================================
// GET QUESTIONS
// ========================================

router.get(

  '/questions/:assessmentId',

  protect,

  authorizeRoles('student', 'admin'),

  getAssessmentQuestions

);

// ========================================
// SAVE ANSWER
// ========================================

router.post(

  '/save-answer',

  protect,

  authorizeRoles('student', 'admin'),

  saveAnswer

);

// ========================================
// SUBMIT ASSESSMENT
// ========================================

router.post(

  '/submit',

  protect,

  authorizeRoles('student', 'admin'),

  submitAssessment

);

// ========================================
// GET RESULT
// ========================================

router.get(

  '/result/:resultId',

  protect,

  authorizeRoles('student', 'admin'),

  getResult

);

// ========================================
// TAB SWITCH DETECTION
// ========================================

router.post(

  '/tab-switch',

  protect,

  authorizeRoles('student', 'admin'),

  flagTabSwitch

);

// ========================================
// FULLSCREEN EXIT DETECTION
// ========================================

router.post(

  '/fullscreen-exit',

  protect,

  authorizeRoles('student', 'admin'),

  flagFullscreenExit

);

// ========================================
// EXPORT
// ========================================

module.exports = router;