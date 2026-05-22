const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    activityType: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    ipAddress: {
        type: String
    },

    deviceInfo: {
        type: String
    },

    status: {
        type: String,
        enum: ["success", "failed"],
        default: "success"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);