const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
{
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true
    },

    question: {
        type: String,
        required: true
    },

    options: [{
        type: String
    }],

    correctAnswer: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["mcq", "coding"],
        default: "mcq"
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
        type: String
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Question", questionSchema);