const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();

const app = express();

const port =
  process.env.PORT || 5000;

// ======================================
// DATABASE CONNECTION
// ======================================

const connectDB =
  require("./db");

connectDB();

// ======================================
// MIDDLEWARES
// ======================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({

    extended: true

  })
);

// ======================================
// STATIC FILES
// ======================================

app.use(

  "/uploads",

  express.static("uploads")

);

// ======================================
// ROUTE IMPORTS
// ======================================

// AUTH

const authRoutes =
  require("./routes/auth");

// COURSES

const courseRoutes =
  require("./routes/courses");

// VIDEOS

const videoRoutes =
  require("./routes/videos");

// STUDENTS

const studentRoutes =
  require("./routes/studentRoutes");

// ENROLLMENTS

const enrollmentRoutes =
  require("./routes/enrollments");

// PAYMENTS

const paymentRoutes =
  require("./routes/payments");


// CERTIFICATES

const certificateRoutes =
  require("./routes/certificateRoutes");


// ======================================
// PHASE 5
// ======================================

// PROGRESS ENGINE

const progressRoutes =
  require(
    "./routes/progressRoutes"
  );

// ======================================
// PHASE 6
// ======================================

// ADMIN ASSESSMENTS

const assessmentRoutes =
  require(
    "./routes/assessments"
  );

// STUDENT ASSESSMENTS

const studentAssessmentRoutes =
  require(
    "./routes/studentAssessmentRoutes"
  );

// QUESTIONS

const questionRoutes =
  require(
    "./routes/questionRoutes"
  );

// ======================================
// ENABLE ROUTES
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

// CERTIFICATES

app.use(

  "/api/certificates",

  certificateRoutes

);

// ======================================
// PHASE 5 ROUTES
// ======================================

// PROGRESS

app.use(

  "/api/progress",

  progressRoutes

);

// ======================================
// PHASE 6 ROUTES
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

// QUESTION ENGINE

app.use(

  "/api/questions",

  questionRoutes

);

// ======================================
// DATABASE TEST ROUTE
// ======================================

app.get(

  "/db-test",

  async (req, res) => {

    try {

      res.json({

        success: true,

        message:
          "MongoDB Connected ✅"

      });

    } catch (err) {

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }

);

// ======================================
// HOME ROUTE
// ======================================

app.get(

  "/",

  (req, res) => {

    res.send(
      "Backend Running 🚀"
    );

  }

);

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use(

  (

    err,

    req,

    res,

    next

  ) => {

    console.log(err);

    res.status(500).json({

      success: false,

      message:

        err.message ||

        "Server Error"

    });

  }

);

// ======================================
// START SERVER
// ======================================

app.listen(

  port,

  () => {

    console.log(

      `Server is running on port ${port}`

    );

  }

);