const express = require('express');

const router = express.Router();

const {

  getStudents,
  updateStudentStatus

} = require('../controllers/studentController');

const protect = require('../middlewares/authMiddleware');


// GET ALL STUDENTS
router.get('/', protect, getStudents);


// BLOCK / UNBLOCK STUDENT
router.put('/:id', protect, updateStudentStatus);


module.exports = router;