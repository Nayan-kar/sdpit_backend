const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (email, password, active) VALUES (?, ?, 1)',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    
    if (!user.active) {
      return res.status(403).json({ message: 'User is blocked' });
    }

    // Since this is a new setup, we might have plain text passwords from the old system.
    // We try bcrypt first, if it fails, we can fall back or just reject.
    const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    
    // Fallback for plain text password if old system didn't hash (Optional, based on 'Test@12345Ab#' setup)
    if (!isMatch && password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Define role based on some logic. For simplicity, let's say admin@sdpit.in is admin
    const role = email === 'admin@sdpit.in' ? 'admin' : 'student';

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
