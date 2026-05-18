const Enrollment = require('../models/Enrollment');

const Course = require('../models/Course');

// ENROLL FREE COURSE
const enrollFreeCourse = async (req, res) => {

  try {

    const userId = req.user.id;

    const { courseId } = req.body;

    // FIND COURSE
    const course = await Course.findById(courseId);

    if (!course) {

      return res.status(404).json({
        message: 'Course not found'
      });

    }

    // PAID COURSE CHECK
    if (course.isPaid) {

      return res.status(400).json({
        message: 'This is a paid course'
      });

    }

    // CHECK EXISTING ENROLLMENT
    const existingEnrollment =
      await Enrollment.findOne({

        userId,

        courseId,

        expiryDate: { $gt: new Date() }

      });

    if (existingEnrollment) {

      return res.status(400).json({
        message: 'Already enrolled'
      });

    }

    // CALCULATE EXPIRY
    const expiryDate = new Date();

    expiryDate.setDate(
      expiryDate.getDate() + course.duration
    );

    // CREATE ENROLLMENT
    const enrollment = await Enrollment.create({

      userId,

      courseId,

      expiryDate,

      paymentStatus: 'free'

    });

    res.status(201).json({

      message: 'Enrolled successfully',

      enrollment

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

// GET MY COURSES
const getMyCourses = async (req, res) => {

  try {

    const userId = req.user.id;

    // ONLY ACTIVE COURSES
    const enrollments = await Enrollment.find({

      userId,

      expiryDate: { $gt: new Date() }

    }).populate('courseId');

    // EXTRACT COURSES
    const courses = enrollments.map(
      enrollment => enrollment.courseId
    );

    res.status(200).json(courses);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

module.exports = {

  enrollFreeCourse,

  getMyCourses

};