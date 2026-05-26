const express = require("express");

const router = express.Router();

const {
  getVideosByCourseId,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos,
} = require("../controllers/videoController");

const protect = require("../middlewares/authMiddleware");

const adminMiddleware = require("../middlewares/adminMiddleware");

// GET VIDEOS BY COURSE ID
router.get(
  "/:courseId",
  protect,
  getVideosByCourseId
);

// CREATE VIDEO
router.post(
  "/",
  protect,
  adminMiddleware,
  createVideo
);

// REORDER VIDEOS
router.put(
  "/reorder",
  protect,
  adminMiddleware,
  reorderVideos
);

// UPDATE VIDEO
router.put(
  "/:id",
  protect,
  adminMiddleware,
  updateVideo
);

// DELETE VIDEO
router.delete(
  "/:id",
  protect,
  adminMiddleware,
  deleteVideo
);

module.exports = router;