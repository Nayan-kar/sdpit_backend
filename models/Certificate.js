const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
{
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment"
    },

    certificateId: {
        type: String,
        required: true,
        unique: true
    },

    issueDate: {
        type: Date,
        default: Date.now
    },

    qrCode: {
        type: String
    },

    pdfUrl: {
        type: String
    },

    verificationStatus: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Certificate", certificateSchema);