const express = require('express');

const cors = require('cors');

const dotenv = require('dotenv');

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;


// MONGODB CONNECTION
const connectDB = require('./db');

connectDB();


// MIDDLEWARES
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));


// ROUTES
const authRoutes = require('./routes/auth');

const courseRoutes = require('./routes/courses');

const videoRoutes = require('./routes/videos');

const studentRoutes = require('./routes/students');

const enrollmentRoutes = require('./routes/enrollments');

const paymentRoutes = require('./routes/payments');


// ENABLED ROUTES
app.use('/api/auth', authRoutes);

app.use('/api/courses', courseRoutes);

app.use('/api/videos', videoRoutes);

app.use('/api/students', studentRoutes);

app.use('/api/enrollments', enrollmentRoutes);

app.use('/api/payments', paymentRoutes);


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
app.get('/', (req, res) => {

  res.send('Backend Running 🚀');

});


// START SERVER
app.listen(port, () => {

  console.log(`Server is running on port ${port}`);

});