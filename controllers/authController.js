const User = require('../models/User');

const bcrypt = require('bcryptjs');

const validator = require('validator');

const otpGenerator = require('otp-generator');

const nodemailer = require('nodemailer');

const generateToken = require('../utils/generateToken');

const generateStudentId = require('../utils/generateStudentId');

const generateUsername = require('../utils/generateUsername');


// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({

  service: 'gmail',

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS

  }

});


// REGISTER USER
const register = async (req, res) => {

  try {

    const {
      fullName,
      email,
      mobile,
      dob,
      password
    } = req.body;

    // REQUIRED FIELDS
    if (!fullName || !email || !password) {

      return res.status(400).json({

        success: false,

        message: 'Please fill all required fields'

      });

    }

    // EMAIL VALIDATION
    if (!validator.isEmail(email)) {

      return res.status(400).json({

        success: false,

        message: 'Invalid email format'

      });

    }

    // STRONG PASSWORD VALIDATION
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(password)) {

      return res.status(400).json({

        success: false,

        message:
          'Weak password. Password must contain minimum 8 characters, one uppercase letter, one lowercase letter, one number and one special symbol.'

      });

    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({

        success: false,

        message: 'User already exists'

      });

    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // GENERATE STUDENT ID
    const studentId = generateStudentId();

    // GENERATE USERNAME
    const username = generateUsername(fullName);

    // GENERATE OTP
    const otp = otpGenerator.generate(6, {

      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false

    });

    // OTP EXPIRY (10 MIN)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // CREATE USER
    const newUser = await User.create({

      fullName,

      email,

      mobile,

      dob,

      password: hashedPassword,

      studentId,

      username,

      otp,

      otpExpiry,

      isVerified: false

    });

    // SEND EMAIL
   // SEND EMAIL
const info = await transporter.sendMail({

  from: process.env.EMAIL_USER,

  to: email,

  subject: 'SDPIT LMS Email Verification OTP',

  html: `

    <h2>Welcome to SDPIT LMS</h2>

    <p>Your OTP for email verification is:</p>

    <h1>${otp}</h1>

    <p>This OTP will expire in 10 minutes.</p>

  `

});

console.log('EMAIL SENT:', info.response);


    // GENERATE TOKEN
    const token = generateToken(newUser._id);

    // RESPONSE
    res.status(201).json({

      success: true,

      message: 'OTP sent to email successfully',

      token,

      user: {

        id: newUser._id,

        fullName: newUser.fullName,

        email: newUser.email,

        studentId: newUser.studentId,

        username: newUser.username,

        role: newUser.role,

        isVerified: newUser.isVerified

      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// VERIFY OTP
const verifyOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({

        success: false,

        message: 'User not found'

      });

    }

    // CHECK OTP
    if (user.otp !== otp) {

      return res.status(400).json({

        success: false,

        message: 'Invalid OTP'

      });

    }

    // CHECK EXPIRY
    if (user.otpExpiry < new Date()) {

      return res.status(400).json({

        success: false,

        message: 'OTP expired'

      });

    }

    // VERIFY USER
    user.isVerified = true;

    user.otp = null;

    user.otpExpiry = null;

    await user.save();

    res.status(200).json({

      success: true,

      message: 'Email verified successfully'

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// LOGIN USER
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({

        success: false,

        message: 'User not found'

      });

    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(401).json({

        success: false,

        message: 'Invalid credentials'

      });

    }

    // CHECK EMAIL VERIFIED
    if (!user.isVerified) {

      return res.status(401).json({

        success: false,

        message: 'Please verify your email first'

      });

    }

    // GENERATE TOKEN
    const token = generateToken(user._id);

    res.status(200).json({

      success: true,

      message: 'Login successful',

      token,

      user: {

        id: user._id,

        fullName: user.fullName,

        email: user.email,

        studentId: user.studentId,

        username: user.username,

        role: user.role,

        isVerified: user.isVerified

      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: 'Server error'

    });

  }

};


module.exports = {
  register,
  login,
  verifyOtp
};