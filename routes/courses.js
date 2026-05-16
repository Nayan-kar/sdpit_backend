const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', verifyToken, getCourses);
router.get('/:id', verifyToken, getCourseById);
router.post('/', verifyAdmin, createCourse);
router.put('/:id', verifyAdmin, updateCourse);
router.delete('/:id', verifyAdmin, deleteCourse);

module.exports = router;
