const express = require("express");

const router = express.Router();

// ==========================================
// CONTROLLERS
// ==========================================

const {

  saveVideoProgress,

  getCourseLearningState,

} = require(
  "../controllers/progressController"
);

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const {

  protect

} = require(
  "../middlewares/authMiddleware"
);

// ==========================================
// SAVE VIDEO PROGRESS
// ==========================================

router.post(

  "/save-progress",

  protect,

  saveVideoProgress

);

// ==========================================
// GET COURSE LEARNING STATE
// ==========================================

router.get(

  "/course/:courseId",

  protect,

  getCourseLearningState

);

// ==========================================
// EXPORT
// ==========================================

module.exports = router;