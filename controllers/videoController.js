const Video = require("../models/Video");
const Course = require("../models/Course");

// GET VIDEOS BY COURSE ID
const getVideosByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    const videos = await Video.find({ courseId }).sort({
      videoOrder: 1,
    });

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// CREATE VIDEO
const createVideo = async (req, res) => {
  try {
    const {
      title,
      videoUrl,
      duration,
      courseId,
      isPreview,
    } = req.body;

    // VALIDATION
    if (!title || !videoUrl || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Title, video URL and course ID are required",
      });
    }

    // CHECK COURSE
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // AUTO VIDEO ORDER
    const totalVideos = await Video.countDocuments({
      courseId,
    });

    const video = await Video.create({
      title,
      videoUrl,
      duration,
      courseId,
      isPreview,

      videoOrder: totalVideos + 1,

      // FIRST VIDEO UNLOCKED
      isLocked: totalVideos === 0 ? false : true,
    });

    // UPDATE COURSE VIDEO COUNT
    course.totalVideos += 1;

    await course.save();

    res.status(201).json({
      success: true,
      message: "Video created successfully",
      video,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE VIDEO
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      videoUrl,
      duration,
      isPreview,
    } = req.body;

    const existingVideo = await Video.findById(id);

    if (!existingVideo) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      {
        title,
        videoUrl,
        duration,
        isPreview,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE VIDEO
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // DELETE VIDEO
    await Video.findByIdAndDelete(id);

    // UPDATE COURSE VIDEO COUNT
    await Course.findByIdAndUpdate(video.courseId, {
      $inc: { totalVideos: -1 },
    });

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// REORDER VIDEOS
const reorderVideos = async (req, res) => {
  try {
    const { courseId, videos } = req.body;

    // VALIDATION
    if (!courseId || !videos || !Array.isArray(videos)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }

    // UPDATE VIDEO ORDERS
    for (let i = 0; i < videos.length; i++) {
      await Video.findByIdAndUpdate(videos[i]._id, {
        videoOrder: i + 1,
      });
    }

    // GET UPDATED VIDEOS
    const updatedVideos = await Video.find({
      courseId,
    }).sort({
      videoOrder: 1,
    });

    res.status(200).json({
      success: true,
      message: "Videos reordered successfully",
      videos: updatedVideos,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getVideosByCourseId,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos,
};