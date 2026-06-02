const mongoose =
  require("mongoose");

const questionSchema =
  new mongoose.Schema(

    {

      // ======================================
      // ASSESSMENT
      // ======================================

      assessment: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Assessment",

        required: true

      },

      // ======================================
      // OPTIONAL COURSE
      // ======================================

      course: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Course",

        required: false

      },

      // ======================================
      // QUESTION TYPE
      // ======================================

      type: {

        type: String,

        enum: [

          "mcq",

          "coding"

        ],

        default: "mcq"

      },

      // ======================================
      // COMMON FIELDS
      // ======================================

      question: {

        type: String,

        trim: true

      },

      title: {

        type: String,

        trim: true

      },

      marks: {

        type: Number,

        default: 1

      },

      difficulty: {

        type: String,

        enum: [

          "Easy",

          "Medium",

          "Hard"

        ],

        default: "Easy"

      },

      explanation: {

        type: String,

        trim: true

      },

      status: {

        type: String,

        enum: [

          "Active",

          "Draft",

          "Archived"

        ],

        default: "Active"

      },

      // ======================================
      // MCQ FIELDS
      // ======================================

      options: [

        {

          type: String,

          trim: true

        }

      ],

      correctAnswer: {

        type: String,

        trim: true

      },

      // ======================================
      // CODING QUESTION FIELDS
      // ======================================

      problemStatement: {

        type: String

      },

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

      // ======================================
      // TEST CASES
      // ======================================

      testCases: [

        {

          input: {

            type: String

          },

          output: {

            type: String

          }

        }

      ],

      // ======================================
      // MANAGEMENT
      // ======================================

      isActive: {

        type: Boolean,

        default: true

      },

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

    "Question",

    questionSchema

  );