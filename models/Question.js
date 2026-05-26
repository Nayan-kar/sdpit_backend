const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
{
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    // Question Type
    type: {
        type: String,
        enum: ["mcq", "coding"],
        default: "mcq"
    },

    // =========================
    // COMMON FIELDS
    // =========================

    question: {
        type: String,
        required: true,
        trim: true
    },

    marks: {
        type: Number,
        default: 1
    },

    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "easy"
    },

    explanation: {
        type: String,
        trim: true
    },

    // =========================
    // MCQ FIELDS
    // =========================

    options: [{
        type: String,
        trim: true
    }],

    correctAnswer: {
        type: String,
        trim: true
    },

    // =========================
    // CODING QUESTION FIELDS
    // =========================

    starterCode: {
        type: String
    },

    inputFormat: {
        type: String
    },

    outputFormat: {
        type: String
    },

    constraints: {
        type: String
    },

    sampleInput: {
        type: String
    },

    sampleOutput: {
        type: String
    },

    expectedSolution: {
        type: String
    },

    // =========================
    // MANAGEMENT
    // =========================

    isActive: {
        type: Boolean,
        default: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Question", questionSchema);