const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String,
        default: ''
    },

    duration: {
        type: String
    },

    fees: {
        type: Number,
        default: 0
    },

    category: {
        type: String
    },

    instructor: {
        type: String
    },

    isPublished: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Course", courseSchema);