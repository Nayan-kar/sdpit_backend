const User = require('../models/User');
const Course = require('../models/Course');


// ======================================
// ADMIN FUNCTIONS
// ======================================


// GET ALL STUDENTS
const getStudents = async (req, res) => {

  try {

    const students = await User.find().select(
      '_id name email active role'
    );

    res.status(200).json(students);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};


// BLOCK / UNBLOCK STUDENT
const updateStudentStatus = async (req, res) => {

  try {

    const { id } = req.params;

    const { active } = req.body;

    const updatedStudent = await User.findByIdAndUpdate(

      id,

      { active },

      { new: true }

    );

    if (!updatedStudent) {

      return res.status(404).json({
        message: 'Student not found'
      });

    }

    res.status(200).json({

      message: `Student ${active ? 'unblocked' : 'blocked'} successfully`

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};



// ======================================
// STUDENT DASHBOARD FUNCTIONS
// ======================================


// GET STUDENT PROFILE
const getStudentProfile = async (req, res) => {

  try {

    const student = await User.findById(req.user.id)
      .select('-password');

    if (!student) {

      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });

    }

    res.status(200).json({
      success: true,
      student
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }

};


// GET MY COURSES
const getMyCourses = async (req, res) => {

  try {

    const student = await User.findById(req.user.id)
      .populate('enrolledCourses');

    if (!student) {

      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });

    }

    res.status(200).json({
      success: true,
      courses: student.enrolledCourses
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }

};


// COURSE PROGRESS
const getCourseProgress = async (req, res) => {

  try {

    // Real logic in Phase 5

    res.status(200).json({
      success: true,
      progress: []
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }

};


// ASSESSMENT STATUS
const getAssessmentStatus = async (req, res) => {

  try {

    // Real logic in Phase 6

    res.status(200).json({
      success: true,
      assessments: []
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }

};


// CERTIFICATES
const getCertificates = async (req, res) => {

  try {

    // Real logic in Phase 7

    res.status(200).json({
      success: true,
      certificates: []
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }

};



// ======================================
// EXPORTS
// ======================================

module.exports = {

  // ADMIN
  getStudents,
  updateStudentStatus,

  // STUDENT DASHBOARD
  getStudentProfile,
  getMyCourses,
  getCourseProgress,
  getAssessmentStatus,
  getCertificates

};