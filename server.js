const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;


// ======================================
// MONGODB CONNECTION
// ======================================

const connectDB = require("./db");

connectDB();


// ======================================
// MIDDLEWARES
// ======================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// ======================================
// STATIC UPLOADS ACCESS
// ======================================

app.use(
  "/uploads",
  express.static("uploads")
);


// ======================================
// ROUTES IMPORTS
// ======================================

// AUTH ROUTES

const authRoutes =
  require("./routes/auth");

// COURSE ROUTES

const courseRoutes =
  require("./routes/courses");

// VIDEO ROUTES

const videoRoutes =
  require("./routes/videos");

// STUDENT ROUTES

const studentRoutes =
  require("./routes/studentRoutes");

// ENROLLMENT ROUTES

const enrollmentRoutes =
  require("./routes/enrollments");

// PAYMENT ROUTES

const paymentRoutes =
  require("./routes/payments");

// ======================================
// PHASE 5 ROUTES
// ======================================

const progressRoutes =
  require("./routes/progressRoutes");

// ======================================
// PHASE 6 ROUTES
// ======================================

// ADMIN ASSESSMENT ROUTES

const assessmentRoutes =
  require("./routes/assessments");

// STUDENT ASSESSMENT ROUTES

const studentAssessmentRoutes =
  require(
    "./routes/studentAssessmentRoutes"
  );


// ======================================
// ENABLED ROUTES
// ======================================

// AUTH

app.use(
  "/api/auth",
  authRoutes
);

// COURSES

app.use(
  "/api/courses",
  courseRoutes
);

// VIDEOS

app.use(
  "/api/videos",
  videoRoutes
);

// STUDENTS

app.use(
  "/api/students",
  studentRoutes
);

// ENROLLMENTS

app.use(
  "/api/enrollments",
  enrollmentRoutes
);

// PAYMENTS

app.use(
  "/api/payments",
  paymentRoutes
);


// ======================================
// PHASE 5 ROUTES ENABLE
// ======================================

// PROGRESS ENGINE

app.use(
  "/api/progress",
  progressRoutes
);


// ======================================
// PHASE 6 ROUTES ENABLE
// ======================================

// ADMIN ASSESSMENTS

app.use(
  "/api/assessments",
  assessmentRoutes
);

// STUDENT ASSESSMENT ENGINE

app.use(
  "/api/student-assessments",
  studentAssessmentRoutes
);


// ======================================
// DATABASE TEST ROUTE
// ======================================

app.get("/db-test", async (req, res) => {

  try {

    res.json({

      success: true,

      message:
        "MongoDB Connected ✅",

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      error: err.message,

    });

  }

});


// ======================================
// HOME ROUTE
// ======================================

app.get("/", (req, res) => {

  res.send("Backend Running 🚀");

});


// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use((err, req, res, next) => {

  console.log(err);

  res.status(500).json({

    success: false,

    message:
      err.message || "Server Error",

  });

});


// ======================================
// START SERVER
// ======================================

app.listen(port, () => {

  console.log(

    `Server is running on port ${port}`

  );

});