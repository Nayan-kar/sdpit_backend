const Assessment =
  require("../models/Assessment");

const Question =
  require("../models/Question");

const ExamAttempt =
  require("../models/ExamAttempt");

// ======================================================
// GET ALL ASSESSMENTS
// ======================================================

const getAssessments = async (

  req,

  res

) => {

  try {

    const assessments =
      await Assessment.find()

        .populate(
          "course",
          "title"
        )

        .sort({
          createdAt: -1
        });

    res.status(200).json({

      success: true,

      assessments

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch assessments"

    });

  }

};

// ======================================================
// CREATE ASSESSMENT
// ======================================================

const createAssessment = async (

  req,

  res

) => {

  try {

    const {

      course,

      title,

      description,

      duration,

      passingMarks,

      totalMCQQuestions,

      totalCodingQuestions

    } = req.body;

    const assessment =
      await Assessment.create({

        course,

        title,

        description,

        duration,

        passingMarks,

        totalMCQQuestions,

        totalCodingQuestions,

        createdBy:
          req.user._id

      });

    res.status(201).json({

      success: true,

      message:
        "Assessment created successfully",

      assessment

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to create assessment"

    });

  }

};

// ======================================================
// ADD QUESTION
// ======================================================

const addQuestion = async (

  req,

  res

) => {

  try {

    const {

      // ======================================
      // FRONTEND FIELD
      // ======================================

      assessmentId,

      // ======================================
      // COMMON FIELDS
      // ======================================

      course,

      type,

      question,

      options,

      correctAnswer,

      marks,

      difficulty,

      explanation,

      status,

      // ======================================
      // CODING FIELDS
      // ======================================

      title,

      starterCode,

      inputFormat,

      outputFormat,

      constraints,

      sampleInput,

      sampleOutput,

      expectedSolution,

      testCases,

      problemStatement

    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!assessmentId) {

      return res.status(400).json({

        success: false,

        message:
          "Assessment ID is required"

      });

    }

    // ======================================
    // CREATE QUESTION
    // ======================================

    const newQuestion =
      await Question.create({

        // FIXED FIELD

        assessment:
          assessmentId,

        course,

        // LOWERCASE TYPES

        type:
          type?.toLowerCase(),

        // MCQ FIELDS

        question,

        options,

        correctAnswer,

        // COMMON

        marks,

        difficulty,

        explanation,

        status,

        // CODING FIELDS

        title,

        starterCode,

        inputFormat,

        outputFormat,

        constraints,

        sampleInput,

        sampleOutput,

        expectedSolution,

        testCases,

        problemStatement,

        // ADMIN

        createdBy:
          req.user._id

      });

    res.status(201).json({

      success: true,

      message:
        "Question added successfully",

      question:
        newQuestion

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to add question"

    });

  }

};

// ======================================================
// GET RANDOMIZED QUESTIONS
// ======================================================

const getAssessmentQuestions =
  async (req, res) => {

    try {

      const { assessmentId } =
        req.params;

      const assessment =
        await Assessment.findById(
          assessmentId
        );

      if (!assessment) {

        return res.status(404).json({

          success: false,

          message:
            "Assessment not found"

        });

      }

      // ======================================
      // RANDOM MCQ QUESTIONS
      // ======================================

      const mcqQuestions =
        await Question.aggregate([

          {

            $match: {

              assessment:
                assessment._id,

              type: "mcq",

              isActive: true

            }

          },

          {

            $sample: {

              size:
                assessment.totalMCQQuestions

            }

          }

        ]);

      // ======================================
      // RANDOM CODING QUESTIONS
      // ======================================

      const codingQuestions =
        await Question.aggregate([

          {

            $match: {

              assessment:
                assessment._id,

              type: "coding",

              isActive: true

            }

          },

          {

            $sample: {

              size:
                assessment.totalCodingQuestions

            }

          }

        ]);

      res.status(200).json({

        success: true,

        mcqQuestions,

        codingQuestions

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch questions"

      });

    }

  };

// ======================================================
// START ASSESSMENT
// ======================================================

const startAssessment = async (

  req,

  res

) => {

  try {

    const { assessmentId } =
      req.params;

    const attempt =
      await ExamAttempt.create({

        student:
          req.user._id,

        assessment:
          assessmentId,

        status:
          "in-progress",

        startedAt:
          new Date()

      });

    res.status(201).json({

      success: true,

      message:
        "Assessment started",

      attempt

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to start assessment"

    });

  }

};

// ======================================================
// SUBMIT ASSESSMENT
// ======================================================

const submitAssessment = async (

  req,

  res

) => {

  try {

    const { attemptId } =
      req.params;

    const { answers } =
      req.body;

    const attempt =
      await ExamAttempt.findById(
        attemptId
      );

    if (!attempt) {

      return res.status(404).json({

        success: false,

        message:
          "Attempt not found"

      });

    }

    let totalScore = 0;

    let totalMarks = 0;

    const evaluatedAnswers = [];

    for (const answer of answers) {

      const question =
        await Question.findById(
          answer.question
        );

      if (!question) continue;

      totalMarks +=
        question.marks;

      let isCorrect = false;

      let marksObtained = 0;

      // ======================================
      // MCQ EVALUATION
      // ======================================

      if (

        question.type === "mcq"

      ) {

        isCorrect =

          answer.selectedAnswer ===

          question.correctAnswer;

        if (isCorrect) {

          marksObtained =
            question.marks;

          totalScore +=
            question.marks;

        }

      }

      // ======================================
      // CODING PLACEHOLDER
      // ======================================

      if (

        question.type === "coding"

      ) {

        marksObtained = 0;

      }

      evaluatedAnswers.push({

        question:
          question._id,

        selectedAnswer:
          answer.selectedAnswer,

        submittedCode:
          answer.submittedCode,

        isCorrect,

        marksObtained

      });

    }

    const percentage =

      totalMarks > 0

        ? (totalScore /
            totalMarks) *
          100

        : 0;

    const assessment =
      await Assessment.findById(
        attempt.assessment
      );

    const passed =

      percentage >=

      assessment.passingMarks;

    attempt.answers =
      evaluatedAnswers;

    attempt.score =
      totalScore;

    attempt.totalMarks =
      totalMarks;

    attempt.percentage =
      percentage;

    attempt.passed =
      passed;

    attempt.status =
      "submitted";

    attempt.submittedAt =
      new Date();

    await attempt.save();

    res.status(200).json({

      success: true,

      message:
        "Assessment submitted successfully",

      result: {

        score:
          totalScore,

        totalMarks,

        percentage,

        passed

      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to submit assessment"

    });

  }

};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  getAssessments,

  createAssessment,

  addQuestion,

  getAssessmentQuestions,

  startAssessment,

  submitAssessment

};