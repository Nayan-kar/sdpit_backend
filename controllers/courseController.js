const Course = require('../models/Course');


// GET ALL COURSES
const getCourses = async (req, res) => {

  try {

    const courses = await Course.find();

    res.status(200).json({

      success: true,

      courses

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

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

        success: false,

        message: 'Course not found'

      });

    }

    res.status(200).json({

      success: true,

      course

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// CREATE COURSE
const createCourse = async (req, res) => {

  try {

    const {

      title,
      description,
      duration,
      fees,
      category,
      instructor

    } = req.body;

    // VALIDATION
    if (!title || !description) {

      return res.status(400).json({

        success: false,

        message: 'Title and description are required'

      });

    }

    // CREATE COURSE
    const newCourse = await Course.create({

      title,

      description,

      duration,

      fees,

      category,

      instructor,

      thumbnail: req.file
        ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        : ''

    });

    res.status(201).json({

      success: true,

      message: 'Course created successfully',

      course: newCourse

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// UPDATE COURSE
const updateCourse = async (req, res) => {

  try {

    const { id } = req.params;

    const {

      title,
      description,
      duration,
      fees,
      category,
      instructor,
      thumbnail

    } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(

      id,

      {

        title,

        description,

        duration,

        fees,

        category,

        instructor,

        thumbnail: req.file
          ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
          : thumbnail

      },

      { new: true }

    );

    if (!updatedCourse) {

      return res.status(404).json({

        success: false,

        message: 'Course not found'

      });

    }

    res.status(200).json({

      success: true,

      message: 'Course updated successfully',

      course: updatedCourse

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

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

        success: false,

        message: 'Course not found'

      });

    }

    res.status(200).json({

      success: true,

      message: 'Course deleted successfully'

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

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