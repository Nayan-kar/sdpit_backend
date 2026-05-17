const express = require('express');

const router = express.Router();

const {

  getStudents,
  updateStudentStatus

} = require('../controllers/studentController');

const auth = require('../middleware/auth');

// GET ALL STUDENTS
router.get('/', auth, getStudents);

// BLOCK / UNBLOCK STUDENT
router.put('/:id', auth, updateStudentStatus);

module.exports = router;