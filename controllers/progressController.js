const VideoProgress = require("../models/VideoProgress");
const CourseProgress = require("../models/CourseProgress");
const Video = require("../models/Video");


// ==========================================
// SAVE VIDEO PROGRESS
// ==========================================
exports.saveVideoProgress = async (req, res) => {
  try {

    const studentId = req.user.id;

    const {
      courseId,
      videoId,
      watchPercentage,
      lastWatchedTime,
    } = req.body;


    // Find current video
    const currentVideo = await Video.findById(videoId);

    if (!currentVideo) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }


    // Find or create progress
    let progress = await VideoProgress.findOne({
      studentId,
      videoId,
    });


    if (!progress) {

      progress = await VideoProgress.create({
        studentId,
        courseId,
        videoId,
        watchPercentage,
        lastWatchedTime,
        unlocked: true,
      });

    } else {

      // Prevent lowering progress
      progress.watchPercentage = Math.max(
        progress.watchPercentage,
        watchPercentage
      );

      // Prevent lowering watched time
      progress.lastWatchedTime = Math.max(
        progress.lastWatchedTime,
        lastWatchedTime
      );

      await progress.save();
    }


    // ==========================================
    // IF VIDEO COMPLETED
    // ==========================================
    if (progress.completed) {

      // Find next video
      const nextVideo = await Video.findOne({
        course: courseId,
        order: currentVideo.order + 1,
      });

      // Unlock next video
      if (nextVideo) {

        const existingNextProgress =
          await VideoProgress.findOne({
            studentId,
            videoId: nextVideo._id,
          });

        if (!existingNextProgress) {

          await VideoProgress.create({
            studentId,
            courseId,
            videoId: nextVideo._id,
            unlocked: true,
          });

        } else {

          existingNextProgress.unlocked = true;
          await existingNextProgress.save();
        }
      }
    }


    // ==========================================
    // UPDATE COURSE PROGRESS
    // ==========================================
    const totalVideos = await Video.countDocuments({
      course: courseId,
    });

    const completedVideos =
      await VideoProgress.countDocuments({
        studentId,
        courseId,
        completed: true,
      });


    let courseProgress =
      await CourseProgress.findOne({
        studentId,
        courseId,
      });


    if (!courseProgress) {

      courseProgress = await CourseProgress.create({
        studentId,
        courseId,
        completedVideos,
        totalVideos,
      });

    } else {

      courseProgress.completedVideos =
        completedVideos;

      courseProgress.totalVideos =
        totalVideos;

      await courseProgress.save();
    }


    return res.status(200).json({
      success: true,
      message: "Video progress updated",
      progress,
      courseProgress,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



// ==========================================
// GET COURSE LEARNING STATE
// ==========================================
exports.getCourseLearningState = async (
  req,
  res
) => {
  try {

    const studentId = req.user.id;

    const { courseId } = req.params;

    const videos = await Video.find({
      course: courseId,
    }).sort({ order: 1 });


    const progressData =
      await VideoProgress.find({
        studentId,
        courseId,
      });


    return res.status(200).json({
      success: true,
      videos,
      progressData,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};