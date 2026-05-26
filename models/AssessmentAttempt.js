const mongoose = require('mongoose');

// ========================================
// ANSWER SCHEMA
// ========================================

const answerSchema = new mongoose.Schema({

  question: {

    type: mongoose.Schema.Types.ObjectId,

    ref: 'Question',

    required: true

  },

  answer: {

    type: mongoose.Schema.Types.Mixed,

    default: null

  },

  isCorrect: {

    type: Boolean,

    default: false

  },

  marksObtained: {

    type: Number,

    default: 0

  },

  timeSpent: {

    type: Number,

    default: 0

  }

});

// ========================================
// CHEAT LOG SCHEMA
// ========================================

const cheatLogSchema = new mongoose.Schema({

  type: {

    type: String,

    enum: [

      'TAB_SWITCH',

      'FULLSCREEN_EXIT',

      'COPY_PASTE',

      'MULTIPLE_FACE_DETECTION',

      'WINDOW_BLUR'

    ],

    required: true

  },

  timestamp: {

    type: Date,

    default: Date.now

  },

  details: {

    type: String,

    default: ''

  }

});

// ========================================
// MAIN ATTEMPT SCHEMA
// ========================================

const assessmentAttemptSchema =
  new mongoose.Schema(

    {

      // ========================================
      // STUDENT
      // ========================================

      student: {

        type: mongoose.Schema.Types.ObjectId,

        ref: 'User',

        required: true

      },

      // ========================================
      // ASSESSMENT
      // ========================================

      assessment: {

        type: mongoose.Schema.Types.ObjectId,

        ref: 'Assessment',

        required: true

      },

      // ========================================
      // RANDOMIZED QUESTIONS
      // ========================================

      mcqQuestions: [

        {

          type: mongoose.Schema.Types.ObjectId,

          ref: 'Question'

        }

      ],

      codingQuestions: [

        {

          type: mongoose.Schema.Types.ObjectId,

          ref: 'Question'

        }

      ],

      // ========================================
      // ANSWERS
      // ========================================

      answers: [answerSchema],

      // ========================================
      // SCORING
      // ========================================

      totalQuestions: {

        type: Number,

        default: 0

      },

      attemptedQuestions: {

        type: Number,

        default: 0

      },

      correctAnswers: {

        type: Number,

        default: 0

      },

      incorrectAnswers: {

        type: Number,

        default: 0

      },

      totalMarks: {

        type: Number,

        default: 0

      },

      obtainedMarks: {

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

      passingPercentage: {

        type: Number,

        default: 70

      },

      // ========================================
      // STATUS
      // ========================================

      status: {

        type: String,

        enum: [

          'NOT_STARTED',

          'IN_PROGRESS',

          'SUBMITTED',

          'AUTO_SUBMITTED',

          'EXPIRED'

        ],

        default: 'NOT_STARTED'

      },

      // ========================================
      // TIMING
      // ========================================

      startedAt: {

        type: Date

      },

      submittedAt: {

        type: Date

      },

      duration: {

        type: Number,

        default: 60

      },

      remainingTime: {

        type: Number,

        default: 60 * 60

      },

      totalTimeTaken: {

        type: Number,

        default: 0

      },

      // ========================================
      // AUTO SAVE
      // ========================================

      autoSavedAt: {

        type: Date

      },

      // ========================================
      // CHEAT DETECTION
      // ========================================

      cheatLogs: [cheatLogSchema],

      cheatScore: {

        type: Number,

        default: 0

      },

      tabSwitchCount: {

        type: Number,

        default: 0

      },

      fullscreenExitCount: {

        type: Number,

        default: 0

      },

      suspiciousActivity: {

        type: Boolean,

        default: false

      },

      // ========================================
      // RESULT METADATA
      // ========================================

      resultPublished: {

        type: Boolean,

        default: true

      },

      certificateEligible: {

        type: Boolean,

        default: false

      },

      rank: {

        type: Number,

        default: null

      },

      // ========================================
      // SECURITY
      // ========================================

      ipAddress: {

        type: String,

        default: ''

      },

      deviceInfo: {

        type: String,

        default: ''

      },

      browserInfo: {

        type: String,

        default: ''

      }

    },

    {

      timestamps: true

    }

  );

// ========================================
// INDEXES
// ========================================

assessmentAttemptSchema.index({

  student: 1,

  assessment: 1

});

assessmentAttemptSchema.index({

  status: 1

});

assessmentAttemptSchema.index({

  percentage: -1

});

// ========================================
// EXPORT
// ========================================

module.exports = mongoose.model(

  'AssessmentAttempt',

  assessmentAttemptSchema

);