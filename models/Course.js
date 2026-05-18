const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    default: 0
  },

  isPaid: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);