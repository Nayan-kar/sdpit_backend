const User = require('../models/User');

const bcrypt = require('bcryptjs');

const validator = require('validator');

const generateToken = require('../utils/generateToken');

const generateStudentId = require('../utils/generateStudentId');

const generateUsername = require('../utils/generateUsername');


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

    // CREATE USER
    const newUser = await User.create({

      fullName,

      email,

      mobile,

      dob,

      password: hashedPassword,

      studentId,

      username

    });

    // GENERATE TOKEN
    const token = generateToken(newUser._id);

    // RESPONSE
    res.status(201).json({

      success: true,

      message: 'User registered successfully',

      token,

      user: {

        id: newUser._id,

        fullName: newUser.fullName,

        email: newUser.email,

        studentId: newUser.studentId,

        username: newUser.username,

        role: newUser.role

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

        role: user.role

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
  login
};