
// controllers/authController.js

const User =
  require("../models/User");

const bcrypt =
  require("bcryptjs");

const validator =
  require("validator");

const otpGenerator =
  require("otp-generator");

const generateToken =
  require("../utils/generateToken");

const generateStudentId =
  require("../utils/generateStudentId");

const generateUsername =
  require("../utils/generateUsername");

const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");

// =====================================
// TEMP USER STORAGE
// =====================================

const tempUsers =
  new Map();

// =====================================
// REGISTER USER
// =====================================

const register =
  async (req, res) => {

    try {

      let {
        fullName,
        email,
        mobile,
        dob,
        password,
      } = req.body;

      // =========================
      // LOWERCASE EMAIL
      // =========================

      email =
        email
          ?.trim()
          .toLowerCase();

      // =========================
      // REQUIRED FIELDS
      // =========================

      if (
        !fullName ||
        !email ||
        !mobile ||
        !dob ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill all required fields",

        });

      }

      // =========================
      // EMAIL VALIDATION
      // =========================

      if (
        !validator.isEmail(
          email
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid email format",

        });

      }

      // =========================
      // PASSWORD VALIDATION
      // =========================

      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (
        !strongPasswordRegex.test(
          password
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Password must contain uppercase, lowercase, number and special character.",

        });

      }

      // =========================
      // CHECK EXISTING USER
      // =========================

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400).json({

          success: false,

          message:
            "User already exists",

        });

      }

      // =========================
      // HASH PASSWORD
      // =========================

      const salt =
        await bcrypt.genSalt(
          10
        );

      const hashedPassword =
        await bcrypt.hash(
          password,
          salt
        );

      // =========================
      // GENERATE OTP
      // =========================

      const otp =
        otpGenerator.generate(
          6,
          {

            upperCaseAlphabets:
              false,

            lowerCaseAlphabets:
              false,

            specialChars:
              false,

          }
        );

      // =========================
      // OTP EXPIRY
      // =========================

      const otpExpiry =
        new Date(
          Date.now() +
          10 *
          60 *
          1000
        );

      // =========================
      // TEMP STORE USER
      // =========================

      tempUsers.set(email, {

        fullName,

        email,

        mobile,

        dob,

        password:
          hashedPassword,

        studentId:
          generateStudentId(),

        username:
          generateUsername(
            fullName
          ),

        otp,

        otpExpiry,

      });

      // =========================
      // TEMP OTP DEBUG
      // =========================

      console.log(
        "OTP IS:",
        otp
      );

      // =========================
      // SEND EMAIL Verification OTP
      // =========================

      const messageHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #3b82f6; margin: 0;">SDPIT EDUCATION</h2>
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Professional Learning Platform</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-bottom: 20px;" />
          <p>Hello ${fullName},</p>
          <p>Thank you for registering at SDPIT. To complete your verification, please use the following One-Time Password (OTP):</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a; background-color: #f3f4f6; padding: 10px 20px; border-radius: 5px; border: 1px dashed #3b82f6;">
              ${otp}
            </span>
          </div>
          <p style="color: #ef4444; font-size: 14px;"><strong>Note:</strong> This OTP is valid for 10 minutes. Please do not share this OTP with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated email, please do not reply. © 2026 SDPIT. All rights reserved.</p>
        </div>
      `;

      await sendEmail({
        to: email,
        subject: "SDPIT Email Verification OTP",
        html: messageHtml,
        text: `Your SDPIT verification OTP is: ${otp}`,
      });

      // =========================
      // SUCCESS RESPONSE
      // =========================

      return res.status(201).json({

        success: true,

        message:
          "OTP sent successfully. Please check your email.",

        email,

      });

    } catch (error) {

      console.log(
        "REGISTER ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Registration failed",

      });

    }

  };

// =====================================
// VERIFY OTP
// =====================================

const verifyOtp =
  async (req, res) => {

    try {

      let {
        email,
        otp,
      } = req.body;

      email =
        email
          ?.trim()
          .toLowerCase();

      const tempUser =
        tempUsers.get(email);

      // =========================
      // NO USER
      // =========================

      if (!tempUser) {

        return res.status(404).json({

          success: false,

          message:
            "Registration session expired",

        });

      }

      // =========================
      // OTP EXPIRED
      // =========================

      if (
        tempUser.otpExpiry <
        new Date()
      ) {

        tempUsers.delete(
          email
        );

        return res.status(400).json({

          success: false,

          message:
            "OTP expired",

        });

      }

      // =========================
      // INVALID OTP
      // =========================

      if (
        tempUser.otp !== otp
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid OTP",

        });

      }

      // =========================
      // CREATE USER
      // =========================

      const newUser =
        await User.create({

          fullName:
            tempUser.fullName,

          email:
            tempUser.email,

          mobile:
            tempUser.mobile,

          dob:
            tempUser.dob,

          password:
            tempUser.password,

          studentId:
            tempUser.studentId,

          username:
            tempUser.username,

          isVerified: true,

        });

      // =========================
      // DELETE TEMP USER
      // =========================

      tempUsers.delete(
        email
      );

      // =========================
      // GENERATE TOKEN
      // =========================

      const token =
        generateToken(
          newUser._id
        );

      return res.status(200).json({

        success: true,

        message:
          "Email verified successfully",

        token,

        user: {

          id:
            newUser._id,

          fullName:
            newUser.fullName,

          email:
            newUser.email,

          studentId:
            newUser.studentId,

          username:
            newUser.username,

          role:
            newUser.role,

        },

      });

    } catch (error) {

      console.log(
        "VERIFY OTP ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "OTP verification failed",

      });

    }

  };

// =====================================
// RESEND OTP
// =====================================

const resendOtp =
  async (req, res) => {

    try {

      let { email } =
        req.body;

      email =
        email
          ?.trim()
          .toLowerCase();

      const tempUser =
        tempUsers.get(email);

      if (!tempUser) {

        return res.status(404).json({

          success: false,

          message:
            "Session expired. Please register again.",

        });

      }

      // =========================
      // NEW OTP
      // =========================

      const otp =
        otpGenerator.generate(
          6,
          {

            upperCaseAlphabets:
              false,

            lowerCaseAlphabets:
              false,

            specialChars:
              false,

          }
        );

      // =========================
      // UPDATE TEMP USER
      // =========================

      tempUser.otp = otp;

      tempUser.otpExpiry =
        new Date(
          Date.now() +
          10 *
          60 *
          1000
        );

      tempUsers.set(
        email,
        tempUser
      );

      // =========================
      // DEBUG OTP
      // =========================

      console.log(
        "RESENT OTP:",
        otp
      );

      // =========================
      // SEND EMAIL Verification OTP
      // =========================

      const messageHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #3b82f6; margin: 0;">SDPIT EDUCATION</h2>
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Professional Learning Platform</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-bottom: 20px;" />
          <p>Hello ${tempUser.fullName},</p>
          <p>You requested a new verification OTP. Please use the following One-Time Password (OTP):</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a; background-color: #f3f4f6; padding: 10px 20px; border-radius: 5px; border: 1px dashed #3b82f6;">
              ${otp}
            </span>
          </div>
          <p style="color: #ef4444; font-size: 14px;"><strong>Note:</strong> This OTP is valid for 10 minutes. Please do not share this OTP with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated email, please do not reply. © 2026 SDPIT. All rights reserved.</p>
        </div>
      `;

      await sendEmail({
        to: email,
        subject: "SDPIT Resent OTP",
        html: messageHtml,
        text: `Your SDPIT verification OTP is: ${otp}`,
      });

      return res.status(200).json({

        success: true,

        message:
          "OTP resent successfully",

      });

    } catch (error) {

      console.log(
        "RESEND OTP ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to resend OTP",

      });

    }

  };

// =====================================
// LOGIN
// =====================================

const login =
  async (req, res) => {

    try {

      let {
        email,
        password,
      } = req.body;

      email =
        email
          ?.trim()
          .toLowerCase();

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid credentials",

        });

      }

      const token =
        generateToken(
          user._id
        );

      return res.status(200).json({

        success: true,

        message:
          "Login successful",

        token,

        user: {

          id: user._id,

          fullName:
            user.fullName,

          email:
            user.email,

          studentId:
            user.studentId,

          username:
            user.username,

          role:
            user.role,

        },

      });

    } catch (error) {

      console.log(
        "LOGIN ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server error",

      });

    }

  };


// =====================================
// GET CURRENT USER PROFILE
// =====================================

const getMe = async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }

    return res.status(200).json({

      success: true,

      user,

    });

  } catch (error) {

    console.log("GET ME ERROR:", error);

    return res.status(500).json({

      success: false,

      message: "Server error",

    });

  }

};

// =====================================
// FORGOT PASSWORD
// =====================================

const forgotPassword = async (req, res) => {

  try {

    let { email } = req.body;

    email = email?.trim().toLowerCase();

    if (!email) {

      return res.status(400).json({

        success: false,

        message: "Please provide an email address",

      });

    }

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and save to user
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Expiry: 10 mins
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Reset Link URL
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    console.log("RESET LINK IS:", resetUrl);

    const messageHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #3b82f6; margin: 0;">SDPIT EDUCATION</h2>
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Professional Learning Platform</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-bottom: 20px;" />
        <p>Hello ${user.fullName},</p>
        <p>You requested a password reset for your SDPIT account. Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste the following link into your web browser:</p>
        <p style="word-break: break-all; color: #3b82f6;"><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #6b7280; font-size: 14px;">This link will expire in 10 minutes. If you did not request this, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated email, please do not reply. © 2026 SDPIT. All rights reserved.</p>
      </div>
    `;

    try {

      await sendEmail({
        to: user.email,
        subject: "SDPIT Password Reset Request",
        html: messageHtml,
        text: `You requested a password reset. Please click this link to reset your password: ${resetUrl}`,
      });

      return res.status(200).json({

        success: true,

        message: "Password reset link sent to your email",

      });

    } catch (emailError) {

      console.error("EMAIL ERROR FOR RESET:", emailError);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({

        success: false,

        message: "Email could not be sent. Please try again later.",

      });

    }

  } catch (error) {

    console.log("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({

      success: false,

      message: "Server error",

    });

  }

};

// =====================================
// RESET PASSWORD
// =====================================

const resetPassword = async (req, res) => {

  try {

    const { token } = req.params;

    const { password } = req.body;

    if (!password) {

      return res.status(400).json({

        success: false,

        message: "Please provide a new password",

      });

    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {

      return res.status(400).json({

        success: false,

        message: "Password must contain uppercase, lowercase, number and special character.",

      });

    }

    // Hash incoming token to match database
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {

      return res.status(400).json({

        success: false,

        message: "Invalid or expired token",

      });

    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;

    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({

      success: true,

      message: "Password reset successful. Please login with your new password.",

    });

  } catch (error) {

    console.log("RESET PASSWORD ERROR:", error);

    return res.status(500).json({

      success: false,

      message: "Server error",

    });

  }

};

module.exports = {

  register,

  verifyOtp,

  resendOtp,

  login,

  getMe,

  forgotPassword,

  resetPassword,

};

