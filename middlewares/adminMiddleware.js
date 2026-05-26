const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ======================================
// AUTH PROTECT MIDDLEWARE
// ======================================

const protect = async (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;

    // CHECK TOKEN
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({
        success: false,
        message:
          "Access denied. No token provided.",
      });

    }

    // EXTRACT TOKEN
    const token =
      authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // GET USER
    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "User not found",
      });

    }

    // ATTACH USER
    req.user = user;

    next();

  } catch (error) {

    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });

  }

};

// ======================================
// EXPORT
// ======================================

module.exports = protect;