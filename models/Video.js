const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
    },

    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },

    duration: {
      type: String,
      default: "0 min",
    },

    videoOrder: {
      type: Number,
      required: true,
    },

    isPreview: {
      type: Boolean,
      default: false,
    },

    watchPercentage: {
      type: Number,
      default: 0,
    },

    isLocked: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("Video", videoSchema);