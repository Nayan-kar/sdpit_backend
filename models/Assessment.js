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
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    // Total questions to display
    totalMCQQuestions: {
        type: Number,
        default: 15
    },

    totalCodingQuestions: {
        type: Number,
        default: 5
    },

    // Passing percentage
    passingMarks: {
        type: Number,
        default: 70
    },

    // Duration in minutes
    duration: {
        type: Number,
        default: 30
    },

    // Shuffle settings
    shuffleQuestions: {
        type: Boolean,
        default: true
    },

    shuffleOptions: {
        type: Boolean,
        default: true
    },

    // Security features
    enableTabSwitchLimit: {
        type: Boolean,
        default: true
    },

    maxTabSwitches: {
        type: Number,
        default: 3
    },

    autoSubmitOnTabLimit: {
        type: Boolean,
        default: true
    },

    // Assessment state
    isPublished: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },

    // Created by admin
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Assessment", assessmentSchema);