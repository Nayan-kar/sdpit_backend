const express = require('express');

const router = express.Router();

const videoController = require('../controllers/videoController');

const protect = require('../middlewares/authMiddleware');


// GET VIDEOS BY COURSE ID
router.get(
  '/:courseId',
  protect,
  videoController.getVideosByCourseId
);


// CREATE VIDEO
router.post(
  '/',
  protect,
  videoController.createVideo
);


// UPDATE VIDEO
router.put(
  '/:id',
  protect,
  videoController.updateVideo
);


// DELETE VIDEO
router.delete(
  '/:id',
  protect,
  videoController.deleteVideo
);


module.exports = router;