const express = require('express');
const router = express.Router();
const { getStudents, updateStudentStatus } = require('../controllers/studentController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', verifyAdmin, getStudents);
router.put('/:id/status', verifyAdmin, updateStudentStatus);

module.exports = router;
