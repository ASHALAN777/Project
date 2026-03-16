const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({ message: "UNAUTHORIZED" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

    req.user = {
      id: decoded._id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "ACCESS_TOKEN_EXPIRED" });
    }
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }
};

module.exports = authMiddleware;