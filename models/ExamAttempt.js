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

    answers: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question"
            },

            selectedAnswer: {
                type: String
            },

            isCorrect: {
                type: Boolean
            }
        }
    ],

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

    submittedAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("ExamAttempt", examAttemptSchema);