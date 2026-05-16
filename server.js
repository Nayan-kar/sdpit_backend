const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Database
const db = require('./db');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const videoRoutes = require('./routes/videos');
const studentRoutes = require('./routes/students');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/students', studentRoutes);

// DATABASE TEST ROUTE
app.get('/db-test', async (req, res) => {

  try {

    const [rows] = await db.query('SELECT 1');

    res.json({
      success: true,
      message: 'Database Connected ✅',
      rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// START SERVER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});