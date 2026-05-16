const db = require('../db');

// Get all students (Admin)
const getStudents = async (req, res) => {
  try {
    // Return all users for now, maybe filter by role later
    const [students] = await db.execute('SELECT id, email, active FROM users');
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Block/Unblock student (Admin)
const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    await db.execute('UPDATE users SET active = ? WHERE id = ?', [active ? 1 : 0, id]);
    res.status(200).json({ message: `Student ${active ? 'unblocked' : 'blocked'} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStudents,
  updateStudentStatus
};
