const express = require('express');

const router = express.Router();

const videoController = require('../controllers/videoController');

const auth = require('../middleware/auth');

router.get('/:courseId', auth, videoController.getVideosByCourseId);

router.post('/', auth, videoController.createVideo);

router.put('/:id', auth, videoController.updateVideo);

router.delete('/:id', auth, videoController.deleteVideo);

module.exports = router;