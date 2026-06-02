const mongoose = require("mongoose");

const assessmentSchema =
  new mongoose.Schema(

    {

      // ======================================
      // OPTIONAL COURSE LINK
      // ======================================

      course: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Course",

        required: false

      },

      // ======================================
      // BASIC DETAILS
      // ======================================

      title: {

        type: String,

        required: true,

        trim: true

      },

      description: {

        type: String,

        trim: true

      },

      // ======================================
      // QUESTION CONFIGURATION
      // ======================================

      totalMCQQuestions: {

        type: Number,

        default: 15

      },

      totalCodingQuestions: {

        type: Number,

        default: 5

      },

      // ======================================
      // PASSING SETTINGS
      // ======================================

      passingMarks: {

        type: Number,

        default: 70

      },

      // ======================================
      // EXAM DURATION
      // ======================================

      duration: {

        type: Number,

        default: 30

      },

      // ======================================
      // SHUFFLE SETTINGS
      // ======================================

      shuffleQuestions: {

        type: Boolean,

        default: true

      },

      shuffleOptions: {

        type: Boolean,

        default: true

      },

      // ======================================
      // SECURITY FEATURES
      // ======================================

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

      // ======================================
      // STATUS
      // ======================================

      isPublished: {

        type: Boolean,

        default: false

      },

      isActive: {

        type: Boolean,

        default: true

      },

      // ======================================
      // CREATED BY
      // ======================================

      createdBy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User"

      }

    },

    {

      timestamps: true

    }

  );

module.exports =
  mongoose.model(

    "Assessment",

    assessmentSchema

  );