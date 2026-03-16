const jwt = require("jsonwebtoken");

const refresher = (req, res) => {
  try {

    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY
    );

    const newAccessToken = jwt.sign(
      { _id: decoded._id, email: decoded.email, role: decoded.role},
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: "20m" }
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge:  20 *60 * 1000
    });

    res.json({ message: "Token refreshed" });

  } catch (err) {

    return res.status(403).json({ message: "Invalid refresh token" });

  }
};

module.exports = refresher;