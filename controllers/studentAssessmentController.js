const Assessment =
  require('../models/Assessment');

const Question =
  require('../models/Question');

const AssessmentAttempt =
  require('../models/AssessmentAttempt');

// ========================================
// SHUFFLE UTILITY
// ========================================

const shuffleArray = (array) => {

  return array.sort(

    () => Math.random() - 0.5

  );

};

// ========================================
// START ASSESSMENT
// ========================================

exports.startAssessment = async (

  req,

  res

) => {

  try {

    const { assessmentId } =
      req.params;

    const studentId =
      req.user.id;

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

    // CHECK EXISTING ATTEMPT

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

    // FETCH QUESTIONS

    let mcqQuestions =
      await Question.find({

        assessment: assessmentId,

        type: 'mcq'

      });

    let codingQuestions =
      await Question.find({

        assessment: assessmentId,

        type: 'coding'

      });

    // SHUFFLE QUESTIONS

    mcqQuestions =
      shuffleArray(mcqQuestions);

    codingQuestions =
      shuffleArray(codingQuestions);

    // SELECT QUESTIONS

    const selectedMCQs =
      mcqQuestions.slice(

        0,

        assessment.totalMCQQuestions ||
          15

      );

    const selectedCodingQuestions =
      codingQuestions.slice(

        0,

        assessment.totalCodingQuestions ||
          5

      );

    // SHUFFLE OPTIONS

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

    // FINAL QUESTIONS

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

    // CREATE ATTEMPT

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
          assessment.passingMarks || 70,

        status: 'IN_PROGRESS',

        startedAt: new Date(),

        tabSwitchCount: 0,

        fullscreenExitCount: 0,

        cheatScore: 0,

        suspiciousActivity: false

      });

    // RESPONSE

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
          assessment.passingMarks

      },

      attemptId: attempt._id,

      questions: finalQuestions,

      totalQuestions:
        finalQuestions.length,

      startedAt:
        attempt.startedAt,

      remainingTime:
        attempt.remainingTime

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        'Failed to start assessment',

      error: error.message

    });

  }

};

// ========================================
// GET QUESTIONS
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
            'Active attempt not found'

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

        attemptId:
          attempt._id,

        questions,

        answers:
          formattedAnswers,

        remainingTime:
          attempt.remainingTime,

        startedAt:
          attempt.startedAt

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          'Failed to fetch questions'

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
          'Attempt not found'

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
        'Answer saved successfully'

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        'Failed to save answer'

      });

  }

};

// ========================================
// AUTO SAVE
// ========================================

exports.autoSaveAnswers =
  async (req, res) => {

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

        });

      if (!attempt) {

        return res.status(404).json({

          success: false,

          message:
            'Attempt not found'

        });

      }

      for (const questionId in answers) {

        const existingAnswer =
          attempt.answers.find(

            (item) =>

              item.question.toString() ===

              questionId

          );

        if (existingAnswer) {

          existingAnswer.answer =
            answers[questionId];

        } else {

          attempt.answers.push({

            question: questionId,

            answer:
              answers[questionId]

          });

        }

      }

      attempt.autoSavedAt =
        new Date();

      await attempt.save();

      res.status(200).json({

        success: true,

        message:
          'Answers auto saved'

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          'Auto save failed'

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

      assessmentId

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
          'Attempt not found'

      });

    }

    let correctAnswers = 0;

    let incorrectAnswers = 0;

    let obtainedMarks = 0;

    let totalMarks = 0;

    // EVALUATE

    for (const item of attempt.answers) {

      const question =
        item.question;

      // MCQ

      if (

        question.type === 'mcq'

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

      // CODING

      if (

        question.type === 'coding'

      ) {

        totalMarks +=
          question.marks || 5;

      }

    }

    // PERCENTAGE

    const percentage =

      totalMarks > 0

        ? (
            (obtainedMarks /
              totalMarks) *
            100
          ).toFixed(2)

        : 0;

    const passed =

      percentage >=

      attempt.passingPercentage;

    // UPDATE ATTEMPT

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

    attempt.certificateEligible =
      passed;

    await attempt.save();

    // RESPONSE

    res.status(200).json({

      success: true,

      message:
        'Assessment Submitted Successfully',

      resultId:
        attempt._id,

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

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        'Failed to submit assessment'

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

    const { resultId } =
      req.params;

    const studentId =
      req.user.id;

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

    if (!attempt) {

      return res.status(404).json({

        success: false,

        message:
          'Result not found'

      });

    }

    res.status(200).json({

      success: true,

      resultId:
        attempt._id,

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

      correctAnswers:
        attempt.correctAnswers || 0,

      incorrectAnswers:
        attempt.incorrectAnswers ||
        0,

      status:

        attempt.passed

          ? 'Passed'

          : 'Failed',

      submittedAt:
        attempt.submittedAt

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        'Failed to fetch result'

    });

  }

};

// ========================================
// TAB SWITCH
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
          'Attempt not found'

      });

    }

    attempt.tabSwitchCount += 1;

    attempt.cheatScore += 5;

    await attempt.save();

    res.status(200).json({

      success: true,

      tabSwitchCount:
        attempt.tabSwitchCount

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        'Tab switch log failed'

    });

  }

};

// ========================================
// FULLSCREEN EXIT
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
            'Attempt not found'

        });

      }

      attempt.fullscreenExitCount += 1;

      attempt.cheatScore += 5;

      await attempt.save();

      res.status(200).json({

        success: true,

        fullscreenExitCount:
          attempt.fullscreenExitCount

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          'Fullscreen log failed'

      });

    }

  };