const mongoose = require("mongoose");

const examAttemptSchema = new mongoose.Schema(
{
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true
    },

    // =========================
    // ANSWERS
    // =========================

    answers: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question"
            },

            // MCQ answer
            selectedAnswer: {
                type: String
            },

            // Coding answer
            submittedCode: {
                type: String
            },

            isCorrect: {
                type: Boolean,
                default: false
            },

            marksObtained: {
                type: Number,
                default: 0
            }
        }
    ],

    // =========================
    // RESULT DATA
    // =========================

    score: {
        type: Number,
        default: 0
    },

    totalMarks: {
        type: Number,
        default: 0
    },

    percentage: {
        type: Number,
        default: 0
    },

    passed: {
        type: Boolean,
        default: false
    },

    // =========================
    // SECURITY + TRACKING
    // =========================

    tabSwitchCount: {
        type: Number,
        default: 0
    },

    warningCount: {
        type: Number,
        default: 0
    },

    autoSubmitted: {
        type: Boolean,
        default: false
    },

    // =========================
    // TIMER
    // =========================

    startedAt: {
        type: Date,
        default: Date.now
    },

    submittedAt: {
        type: Date
    },

    timeTaken: {
        type: Number, // in seconds
        default: 0
    },

    // =========================
    // ATTEMPT STATUS
    // =========================

    status: {
        type: String,
        enum: ["in-progress", "submitted", "evaluated"],
        default: "in-progress"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("ExamAttempt", examAttemptSchema);