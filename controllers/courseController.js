const Course = require('../models/Course');

// GET ALL COURSES
const getCourses = async (req, res) => {

  try {

    const courses = await Course.find();

    res.status(200).json(courses);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

// GET SINGLE COURSE
const getCourseById = async (req, res) => {

  try {

    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {

      return res.status(404).json({
        message: 'Course not found'
      });

    }

    res.status(200).json(course);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

// CREATE COURSE
const createCourse = async (req, res) => {

  try {

    const {
      name,
      price,
      isPaid,
      duration
    } = req.body;

    const newCourse = await Course.create({

      name,

      price: price || 0,

      isPaid: isPaid || false,

      duration: duration || 30

    });

    res.status(201).json(newCourse);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

// UPDATE COURSE
const updateCourse = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      name,
      price,
      isPaid,
      duration
    } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(

      id,

      {

        name,

        price,

        isPaid,

        duration

      },

      { new: true }

    );

    if (!updatedCourse) {

      return res.status(404).json({
        message: 'Course not found'
      });

    }

    res.status(200).json({

      message: 'Course updated successfully',

      updatedCourse

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

// DELETE COURSE
const deleteCourse = async (req, res) => {

  try {

    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {

      return res.status(404).json({
        message: 'Course not found'
      });

    }

    res.status(200).json({
      message: 'Course deleted successfully'
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

module.exports = {

  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse

};