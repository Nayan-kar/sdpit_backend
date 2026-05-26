const express = require("express");

const router = express.Router();

// ======================================
// CONTROLLERS
// ======================================

const {

  getVideosByCourseId,

  createVideo,

  updateVideo,

  deleteVideo,

  reorderVideos,

} = require(
  "../controllers/videoController"
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
// GET VIDEOS BY COURSE ID
// ======================================

router.get(

  "/:courseId",

  protect,

  getVideosByCourseId

);

// ======================================
// CREATE VIDEO
// ======================================

router.post(

  "/",

  protect,

  authorizeRoles("admin"),

  createVideo

);

// ======================================
// REORDER VIDEOS
// ======================================

router.put(

  "/reorder",

  protect,

  authorizeRoles("admin"),

  reorderVideos

);

// ======================================
// UPDATE VIDEO
// ======================================

router.put(

  "/:id",

  protect,

  authorizeRoles("admin"),

  updateVideo

);

// ======================================
// DELETE VIDEO
// ======================================

router.delete(

  "/:id",

  protect,

  authorizeRoles("admin"),

  deleteVideo

);

// ======================================
// EXPORT
// ======================================

module.exports = router;