const jwt = require('jsonwebtoken');

const User = require('../models/User');


const protect = async (req, res, next) => {

  let token;

  try {

    // CHECK AUTH HEADER
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {

      // EXTRACT TOKEN
      token = req.headers.authorization.split(' ')[1];

      // VERIFY TOKEN
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // GET USER DATA
      req.user = await User.findById(decoded.id)
        .select('-password');

      next();

    } else {

      return res.status(401).json({

        success: false,

        message: 'Not authorized, no token'

      });

    }

  } catch (error) {

    return res.status(401).json({

      success: false,

      message: 'Token failed'

    });

  }

};


module.exports = protect;