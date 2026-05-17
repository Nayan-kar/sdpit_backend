const Video = require('../models/Video');

// GET VIDEOS
const getVideosByCourseId = async (req, res) => {

  try {

    const { courseId } = req.params;

    const videos = await Video.find({ courseId });

    res.status(200).json(videos);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

// CREATE VIDEO
const createVideo = async (req, res) => {

  try {

    const { title, url, courseId } = req.body;

    const video = await Video.create({
      title,
      url,
      courseId
    });

    res.status(201).json(video);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

// UPDATE VIDEO
const updateVideo = async (req, res) => {

  try {

    const { id } = req.params;

    const { title, url, courseId } = req.body;

    const updatedVideo = await Video.findByIdAndUpdate(

      id,

      {
        title,
        url,
        courseId
      },

      {
        new: true
      }

    );

    res.status(200).json(updatedVideo);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

// DELETE VIDEO
const deleteVideo = async (req, res) => {

  try {

    const { id } = req.params;

    await Video.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Video deleted successfully'
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

module.exports = {
  getVideosByCourseId,
  createVideo,
  updateVideo,
  deleteVideo
};