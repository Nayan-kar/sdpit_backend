const adminMiddleware = (req, res, next) => {

  try {

    // CHECK USER
    if (!req.user) {

      return res.status(401).json({

        success: false,

        message: 'User not authenticated'

      });

    }

    // CHECK ROLE
    if (req.user.role !== 'admin') {

      return res.status(403).json({

        success: false,

        message: 'Access denied. Admin only.'

      });

    }

    next();

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

module.exports = adminMiddleware;