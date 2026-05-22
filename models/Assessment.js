const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
{
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    totalQuestions: {
        type: Number,
        default: 15
    },

    passingMarks: {
        type: Number,
        default: 70
    },

    duration: {
        type: Number, // in minutes
        default: 30
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Assessment", assessmentSchema);