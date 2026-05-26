const express = require("express");

const router = express.Router();

const {
  saveVideoProgress,
  getCourseLearningState,
} = require("../controllers/progressController");

const authMiddleware =
  require("../middlewares/authMiddleware");


// ==========================================
// SAVE VIDEO PROGRESS
// ==========================================
router.post(
  "/save-progress",
  authMiddleware,
  saveVideoProgress
);


// ==========================================
// GET COURSE LEARNING STATE
// ==========================================
router.get(
  "/course/:courseId",
  authMiddleware,
  getCourseLearningState
);


module.exports = router;