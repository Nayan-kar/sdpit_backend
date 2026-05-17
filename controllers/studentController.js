const User = require('../models/User');

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

module.exports = {

  getStudents,
  updateStudentStatus

};