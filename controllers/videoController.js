const db = require('../db');

// Get videos for a specific course
const getVideosByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [videos] = await db.execute('SELECT * FROM videos WHERE courseId = ?', [courseId]);
    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a video (Admin)
const createVideo = async (req, res) => {
  try {
    const { title, url, courseId } = req.body;
    const [result] = await db.execute(
      'INSERT INTO videos (title, url, courseId) VALUES (?, ?, ?)',
      [title, url, courseId]
    );
    res.status(201).json({ id: result.insertId, title, url, courseId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a video (Admin)
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, courseId } = req.body;
    await db.execute(
      'UPDATE videos SET title = ?, url = ?, courseId = ? WHERE id = ?',
      [title, url, courseId, id]
    );
    res.status(200).json({ message: 'Video updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a video (Admin)
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM videos WHERE id = ?', [id]);
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getVideosByCourseId,
  createVideo,
  updateVideo,
  deleteVideo
};
