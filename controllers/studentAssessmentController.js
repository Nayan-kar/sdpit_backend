const Assessment = require('../models/Assessment');

const Question = require('../models/Question');

const AssessmentAttempt = require('../models/AssessmentAttempt');

// ========================================
// SHUFFLE ARRAY UTILITY
// ========================================

const shuffleArray = (array) => {

  return array.sort(() => Math.random() - 0.5);

};

// ========================================
// START ASSESSMENT
// ========================================

exports.startAssessment = async (

  req,

  res

) => {

  try {

    const { assessmentId } = req.params;

    const studentId = req.user.id;

    const assessment =
      await Assessment.findById(
        assessmentId
      );

    if (!assessment) {

      return res.status(404).json({

        success: false,

        message:
          'Assessment not found'

      });

    }

    const existingAttempt =
      await AssessmentAttempt.findOne({

        student: studentId,

        assessment: assessmentId,

        status: {

          $in: [

            'IN_PROGRESS',

            'SUBMITTED',

            'AUTO_SUBMITTED'

          ]

        }

      });

    if (existingAttempt) {

      return res.status(400).json({

        success: false,

        message:
          'Assessment already attempted'

      });

    }

    let mcqQuestions =
      await Question.find({

        assessment: assessmentId,

        type: 'MCQ'

      });

    let codingQuestions =
      await Question.find({

        assessment: assessmentId,

        type: 'Coding'

      });

    mcqQuestions =
      shuffleArray(mcqQuestions);

    codingQuestions =
      shuffleArray(codingQuestions);

    const selectedMCQs =
      mcqQuestions.slice(

        0,

        assessment.randomMCQs || 15

      );

    const selectedCodingQuestions =
      codingQuestions.slice(

        0,

        assessment.randomCodingQuestions || 5

      );

    const shuffledMCQs =
      selectedMCQs.map((question) => {

        const q = question.toObject();

        if (

          assessment.shuffleOptions &&

          q.options

        ) {

          q.options =
            shuffleArray(q.options);

        }

        return q;

      });

    let finalQuestions = [

      ...shuffledMCQs,

      ...selectedCodingQuestions

    ];

    if (

      assessment.shuffleQuestions

    ) {

      finalQuestions =
        shuffleArray(finalQuestions);

    }

    const attempt =
      await AssessmentAttempt.create({

        student: studentId,

        assessment: assessmentId,

        mcqQuestions:
          shuffledMCQs.map(

            (q) => q._id

          ),

        codingQuestions:
          selectedCodingQuestions.map(

            (q) => q._id

          ),

        totalQuestions:
          finalQuestions.length,

        duration:
          assessment.duration || 60,

        remainingTime:
          (assessment.duration || 60) *
          60,

        passingPercentage:
          assessment.passingPercentage ||
          70,

        status: 'IN_PROGRESS',

        startedAt: new Date(),

        ipAddress:

          req.ip ||

          req.connection.remoteAddress ||

          '',

        browserInfo:

          req.headers['user-agent'] ||

          '',

        deviceInfo:

          req.headers['sec-ch-ua-platform'] ||

          ''

      });

    res.status(200).json({

      success: true,

      message:
        'Assessment Started Successfully',

      assessment: {

        _id: assessment._id,

        title: assessment.title,

        description:
          assessment.description,

        duration:
          assessment.duration,

        passingPercentage:
          assessment.passingPercentage

      },

      attemptId: attempt._id,

      questions: finalQuestions,

      totalQuestions:
        finalQuestions.length,

      startedAt: attempt.startedAt,

      remainingTime:
        attempt.remainingTime

    });

  } catch (error) {

    console.error(

      'Start Assessment Error:',

      error

    );

    res.status(500).json({

      success: false,

      message:
        'Failed to start assessment',

      error: error.message

    });

  }

};

// ========================================
// GET ASSESSMENT QUESTIONS
// ========================================

exports.getAssessmentQuestions =
  async (req, res) => {

    try {

      const { assessmentId } =
        req.params;

      const studentId =
        req.user.id;

      const attempt =
        await AssessmentAttempt.findOne({

          student: studentId,

          assessment: assessmentId,

          status: 'IN_PROGRESS'

        })

          .populate('mcqQuestions')

          .populate('codingQuestions')

          .populate(
            'answers.question'
          );

      if (!attempt) {

        return res.status(404).json({

          success: false,

          message:
            'Active assessment attempt not found'

        });

      }

      const questions = [

        ...attempt.mcqQuestions,

        ...attempt.codingQuestions

      ];

      const formattedAnswers = {};

      attempt.answers.forEach(
        (item) => {

          formattedAnswers[
            item.question._id
          ] = item.answer;

        }
      );

      res.status(200).json({

        success: true,

        attemptId: attempt._id,

        assessmentId,

        questions,

        answers: formattedAnswers,

        remainingTime:
          attempt.remainingTime,

        startedAt:
          attempt.startedAt,

        totalQuestions:
          attempt.totalQuestions,

        status: attempt.status

      });

    } catch (error) {

      console.error(

        'Get Questions Error:',

        error

      );

      res.status(500).json({

        success: false,

        message:
          'Failed to fetch questions',

        error: error.message

      });

    }

  };

// ========================================
// SAVE ANSWER
// ========================================

exports.saveAnswer = async (

  req,

  res

) => {

  try {

    const {

      assessmentId,

      questionId,

      answer

    } = req.body;

    const studentId =
      req.user.id;

    const attempt =
      await AssessmentAttempt.findOne({

        student: studentId,

        assessment: assessmentId,

        status: 'IN_PROGRESS'

      });

    if (!attempt) {

      return res.status(404).json({

        success: false,

        message:
          'Active attempt not found'

      });

    }

    const existingAnswer =
      attempt.answers.find(

        (item) =>

          item.question.toString() ===

          questionId

      );

    if (existingAnswer) {

      existingAnswer.answer =
        answer;

    } else {

      attempt.answers.push({

        question: questionId,

        answer

      });

    }

    attempt.attemptedQuestions =
      attempt.answers.length;

    attempt.autoSavedAt =
      new Date();

    await attempt.save();

    res.status(200).json({

      success: true,

      message:
        'Answer saved successfully',

      attemptedQuestions:
        attempt.attemptedQuestions

    });

  } catch (error) {

    console.error(

      'Save Answer Error:',

      error

    );

    res.status(500).json({

      success: false,

      message:
        'Failed to save answer',

      error: error.message

    });

  }

};

// ========================================
// SUBMIT ASSESSMENT
// ========================================

exports.submitAssessment = async (

  req,

  res

) => {

  try {

    const {

      assessmentId,

      answers

    } = req.body;

    const studentId =
      req.user.id;

    const attempt =
      await AssessmentAttempt.findOne({

        student: studentId,

        assessment: assessmentId,

        status: 'IN_PROGRESS'

      }).populate('answers.question');

    if (!attempt) {

      return res.status(404).json({

        success: false,

        message:
          'Assessment attempt not found'

      });

    }

    let correctAnswers = 0;

    let incorrectAnswers = 0;

    let obtainedMarks = 0;

    let totalMarks = 0;

    // ========================================
    // EVALUATE ANSWERS
    // ========================================

    for (const item of attempt.answers) {

      const question =
        item.question;

      // MCQ EVALUATION

      if (

        question.type === 'MCQ'

      ) {

        totalMarks +=
          question.marks || 1;

        if (

          item.answer ===

          question.correctAnswer

        ) {

          item.isCorrect = true;

          item.marksObtained =
            question.marks || 1;

          correctAnswers++;

          obtainedMarks +=
            question.marks || 1;

        } else {

          item.isCorrect = false;

          item.marksObtained = 0;

          incorrectAnswers++;

        }

      }

      // CODING QUESTIONS
      // FUTURE AI EVALUATION PLACEHOLDER

      if (

        question.type === 'Coding'

      ) {

        totalMarks +=
          question.marks || 5;

      }

    }

    // ========================================
    // CALCULATE PERCENTAGE
    // ========================================

    const percentage =

      totalMarks > 0

        ? (
            (obtainedMarks /
              totalMarks) *
            100
          ).toFixed(2)

        : 0;

    // ========================================
    // PASS / FAIL
    // ========================================

    const passed =

      percentage >=

      attempt.passingPercentage;

    // ========================================
    // UPDATE ATTEMPT
    // ========================================

    attempt.correctAnswers =
      correctAnswers;

    attempt.incorrectAnswers =
      incorrectAnswers;

    attempt.totalMarks =
      totalMarks;

    attempt.obtainedMarks =
      obtainedMarks;

    attempt.percentage =
      percentage;

    attempt.passed = passed;

    attempt.status =
      'SUBMITTED';

    attempt.submittedAt =
      new Date();

    attempt.totalTimeTaken =

      Math.floor(

        (

          new Date() -

          new Date(
            attempt.startedAt
          )

        ) / 1000

      );

    // ========================================
    // CERTIFICATE ELIGIBILITY
    // ========================================

    attempt.certificateEligible =
      passed;

    await attempt.save();

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({

      success: true,

      message:
        'Assessment Submitted Successfully',

      resultId: attempt._id,

      result: {

        percentage,

        passed,

        correctAnswers,

        incorrectAnswers,

        totalMarks,

        obtainedMarks

      }

    });

  } catch (error) {

    console.error(

      'Submit Assessment Error:',

      error

    );

    res.status(500).json({

      success: false,

      message:
        'Failed to submit assessment',

      error: error.message

    });

  }

};

// ========================================
// GET RESULT
// ========================================

exports.getResult = async (

  req,

  res

) => {

  try {

    // ========================================
    // GET DATA
    // ========================================

    const { resultId } =
      req.params;

    const studentId =
      req.user.id;

    // ========================================
    // FIND RESULT
    // ========================================

    const attempt =
      await AssessmentAttempt.findOne({

        _id: resultId,

        student: studentId

      })

        .populate(
          'assessment',
          'title description'
        )

        .populate(
          'student',
          'name email'
        );

    // ========================================
    // VALIDATE
    // ========================================

    if (!attempt) {

      return res.status(404).json({

        success: false,

        message:
          'Result not found'

      });

    }

    // ========================================
    // FORMAT TIME
    // ========================================

    const totalSeconds =
      attempt.totalTimeTaken || 0;

    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;

    const formattedTime =
      `${minutes}m ${seconds}s`;

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({

      success: true,

      resultId: attempt._id,

      assessmentTitle:

        attempt.assessment?.title ||

        'Assessment',

      studentName:

        attempt.student?.name ||

        'Student',

      score:
        attempt.percentage || 0,

      obtainedMarks:
        attempt.obtainedMarks || 0,

      totalMarks:
        attempt.totalMarks || 0,

      totalQuestions:
        attempt.totalQuestions || 0,

      attemptedQuestions:
        attempt.attemptedQuestions ||
        0,

      correctAnswers:
        attempt.correctAnswers || 0,

      incorrectAnswers:
        attempt.incorrectAnswers ||
        0,

      passingPercentage:
        attempt.passingPercentage ||
        70,

      timeTaken:
        formattedTime,

      status:
        attempt.passed
          ? 'Passed'
          : 'Failed',

      certificateEligible:
        attempt.certificateEligible,

      submittedAt:
        attempt.submittedAt,

      cheatScore:
        attempt.cheatScore || 0,

      tabSwitchCount:
        attempt.tabSwitchCount ||
        0,

      fullscreenExitCount:
        attempt.fullscreenExitCount ||
        0

    });

  } catch (error) {

    console.error(

      'Get Result Error:',

      error

    );

    res.status(500).json({

      success: false,

      message:
        'Failed to fetch result',

      error: error.message

    });

  }

};

// ========================================
// FLAG TAB SWITCH
// ========================================

exports.flagTabSwitch = async (

  req,

  res

) => {

  try {

    const { assessmentId } =
      req.body;

    const studentId =
      req.user.id;

    const attempt =
      await AssessmentAttempt.findOne({

        student: studentId,

        assessment: assessmentId,

        status: 'IN_PROGRESS'

      });

    if (!attempt) {

      return res.status(404).json({

        success: false,

        message:
          'Active attempt not found'

      });

    }

    // ========================================
    // UPDATE COUNTS
    // ========================================

    attempt.tabSwitchCount += 1;

    attempt.cheatScore += 5;

    // ========================================
    // SUSPICIOUS ACTIVITY
    // ========================================

    if (

      attempt.tabSwitchCount >= 3

    ) {

      attempt.suspiciousActivity =
        true;

    }

    // ========================================
    // STORE CHEAT LOG
    // ========================================

    attempt.cheatLogs.push({

      type: 'TAB_SWITCH',

      details:
        'Student switched browser tab during assessment.'

    });

    await attempt.save();

    res.status(200).json({

      success: true,

      message:
        'Tab switch logged',

      tabSwitchCount:
        attempt.tabSwitchCount,

      cheatScore:
        attempt.cheatScore

    });

  } catch (error) {

    console.error(

      'Tab Switch Error:',

      error

    );

    res.status(500).json({

      success: false,

      message:
        'Failed to log tab switch',

      error: error.message

    });

  }

};

// ========================================
// FLAG FULLSCREEN EXIT
// ========================================

exports.flagFullscreenExit =
  async (req, res) => {

    try {

      const { assessmentId } =
        req.body;

      const studentId =
        req.user.id;

      const attempt =
        await AssessmentAttempt.findOne({

          student: studentId,

          assessment: assessmentId,

          status: 'IN_PROGRESS'

        });

      if (!attempt) {

        return res.status(404).json({

          success: false,

          message:
            'Active attempt not found'

        });

      }

      // ========================================
      // UPDATE COUNTS
      // ========================================

      attempt.fullscreenExitCount += 1;

      attempt.cheatScore += 5;

      // ========================================
      // SUSPICIOUS ACTIVITY
      // ========================================

      if (

        attempt.fullscreenExitCount >= 3

      ) {

        attempt.suspiciousActivity =
          true;

      }

      // ========================================
      // STORE CHEAT LOG
      // ========================================

      attempt.cheatLogs.push({

        type: 'FULLSCREEN_EXIT',

        details:
          'Student exited fullscreen during assessment.'

      });

      await attempt.save();

      res.status(200).json({

        success: true,

        message:
          'Fullscreen exit logged',

        fullscreenExitCount:
          attempt.fullscreenExitCount,

        cheatScore:
          attempt.cheatScore

      });

    } catch (error) {

      console.error(

        'Fullscreen Exit Error:',

        error

      );

      res.status(500).json({

        success: false,

        message:
          'Failed to log fullscreen exit',

        error: error.message

      });

    }

  };