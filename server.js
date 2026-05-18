const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB Connection
const connectDB = require('./db');
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const videoRoutes = require('./routes/videos');
const studentRoutes = require('./routes/students');
const enrollmentRoutes = require('./routes/enrollments');

// ENABLED ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// DATABASE TEST ROUTE
app.get('/db-test', async (req, res) => {

  try {

    res.json({
      success: true,
      message: 'MongoDB Connected ✅'
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