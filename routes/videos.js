const express = require('express');
const router = express.Router();
const { getVideosByCourseId, createVideo, updateVideo, deleteVideo } = require('../controllers/videoController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/course/:courseId', verifyToken, getVideosByCourseId);
router.post('/', verifyAdmin, createVideo);
router.put('/:id', verifyAdmin, updateVideo);
router.delete('/:id', verifyAdmin, deleteVideo);

module.exports = router;
