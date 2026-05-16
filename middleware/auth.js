const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'A token is required for authentication' });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || 'secret_key');
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
  return next();
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Admin role required' });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };
