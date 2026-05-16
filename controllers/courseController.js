const db = require('../db');

// Get all courses
const getCourses = async (req, res) => {
  try {
    const [courses] = await db.execute('SELECT * FROM courses');
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single course
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const [courses] = await db.execute('SELECT * FROM courses WHERE id = ?', [id]);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(courses[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a course (Admin)
const createCourse = async (req, res) => {
  try {
    const { name } = req.body;
    const [result] = await db.execute('INSERT INTO courses (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a course (Admin)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await db.execute('UPDATE courses SET name = ? WHERE id = ?', [name, id]);
    res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a course (Admin)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM courses WHERE id = ?', [id]);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
