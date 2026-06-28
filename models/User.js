const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    mobile: {
        type: String
    },

    dob: {
        type: Date
    },

    username: {
        type: String,
        unique: true
    },

    studentId: {
        type: String,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },

    active: {
        type: Boolean,
        default: true
    },

    // ENROLLED COURSES
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],

    // OTP VERIFICATION
    isVerified: {
        type: Boolean,
        default: false
    },

    otp: {
        type: String,
        default: null
    },

    otpExpiry: {
        type: Date,
        default: null
    },

    // PASSWORD RESET
    resetPasswordToken: {
        type: String,
        default: null
    },

    resetPasswordExpire: {
        type: Date,
        default: null
    }

},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);