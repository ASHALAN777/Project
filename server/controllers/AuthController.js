const UserModel = require("../Models/user-schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Signupcontrol = async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body;
    const lowerEmail = email.toLowerCase();

    if (role === "Admin") {
     
      if (adminCode !== process.env.ADMIN_SIGNUP_CODE) {
        return res.status(403).json({
          message: "Invalid admin code!",
          success: false,
        });
      }
    }

    const user = await UserModel.findOne({ email: lowerEmail });

    if (user) {
      return res.status(409).json({ message: "User exist", succes: false });
    }
    const userModel = new UserModel({
      name,
      email: lowerEmail,
      password,
      role,
    });
    userModel.password = await bcrypt.hash(password, 10);

    await userModel.save();
    //   sendgrid
    await sgMail.send({
      from: process.env.SENDGRID_FROM,
      to: lowerEmail,
      subject: "Registration Successful! 🎉",
      html: `    <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome, ${name}! 🎉</h2>
          <p>Your registration was <strong>successful!</strong></p>
          <p>You can now login with your email and password.</p>
          <p>Email: <strong>${lowerEmail}</strong></p>
        </div>`,
    });
    
    // res.json({ message: "OTP send to email", success: true });

    res.status(201).json({
      message: "signup successful",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "signup failed",
      success: false,
    });
  }
};

const Logincontrol = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Email not found", success: false });
    }
    const ispassequal = await bcrypt.compare(password, user.password);
    if (!ispassequal) {
      return res.status(403).json({ message: "Password error", succes: false });
    }

    const access_token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: "20m" },
    );
    const refresh_token = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "15d" },
    );

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 20 * 60 * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "login successful",
      success: true,
      role: user.role,
      email,
      name: user.name,
    });
  } catch (error) {
    return res.status(500).json({
      message: "login failed",
      success: false,
    });
  }
};

module.exports = { Logincontrol, Signupcontrol };
