const express = require('express');

const router = express.Router();

const videoController = require('../controllers/videoController');

const auth = require('../middleware/auth');

// GET VIDEOS
router.get('/:courseId', auth, videoController.getVideosByCourseId);

// CREATE VIDEO
router.post('/', auth, videoController.createVideo);

// UPDATE VIDEO
router.put('/:id', auth, videoController.updateVideo);

// DELETE VIDEO
router.delete('/:id', auth, videoController.deleteVideo);

module.exports = router;