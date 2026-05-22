const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedVideos: {
      type: Number,
      default: 0,
    },

    totalVideos: {
      type: Number,
      default: 0,
    },

    progressPercentage: {
      type: Number,
      default: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);