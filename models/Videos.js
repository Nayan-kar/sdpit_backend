const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  url: {
    type: String,
    required: true
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Video", videoSchema);