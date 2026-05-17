const express = require('express');

const router = express.Router();

const {

  getVideosByCourseId,
  createVideo,
  updateVideo,
  deleteVideo

} = require('../controllers/videoController');

const auth = require('../middleware/auth');

// GET VIDEOS BY COURSE
router.get('/:courseId', auth, getVideosByCourseId);

// CREATE VIDEO
router.post('/', auth, createVideo);

// UPDATE VIDEO
router.put('/:id', auth, updateVideo);

// DELETE VIDEO
router.delete('/:id', auth, deleteVideo);

module.exports = router;