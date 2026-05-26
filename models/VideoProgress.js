const mongoose = require("mongoose");

const videoProgressSchema = new mongoose.Schema(
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

    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    // Watch percentage
    watchPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Last watched second
    lastWatchedTime: {
      type: Number,
      default: 0,
    },

    // Video completion status
    completed: {
      type: Boolean,
      default: false,
    },

    // Completion timestamp
    completedAt: {
      type: Date,
      default: null,
    },

    // Sequential unlock system
    unlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// Prevent duplicate entries
videoProgressSchema.index(
  {
    studentId: 1,
    videoId: 1,
  },
  {
    unique: true,
  }
);


// Auto mark completed if watch percentage >= 90
videoProgressSchema.pre("save", function (next) {
  if (this.watchPercentage >= 90) {
    this.completed = true;

    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  }

  next();
});

module.exports = mongoose.model(
  "VideoProgress",
  videoProgressSchema
);