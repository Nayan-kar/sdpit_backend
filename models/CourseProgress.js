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

    // Completed videos count
    completedVideos: {
      type: Number,
      default: 0,
    },

    // Total videos in course
    totalVideos: {
      type: Number,
      default: 0,
    },

    // Overall course percentage
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Course completion status
    completed: {
      type: Boolean,
      default: false,
    },

    // Assessment unlock status
    assessmentUnlocked: {
      type: Boolean,
      default: false,
    },

    // Course completion timestamp
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// Prevent duplicate progress records
courseProgressSchema.index(
  {
    studentId: 1,
    courseId: 1,
  },
  {
    unique: true,
  }
);


// Auto course completion logic
courseProgressSchema.pre("save", function (next) {

  // Prevent divide by zero
  if (this.totalVideos > 0) {

    this.progressPercentage =
      Math.round(
        (this.completedVideos / this.totalVideos) * 100
      );
  }

  // Mark completed
  if (
    this.completedVideos >= this.totalVideos &&
    this.totalVideos > 0
  ) {

    this.completed = true;
    this.assessmentUnlocked = true;

    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  }

  next();
});

module.exports = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);