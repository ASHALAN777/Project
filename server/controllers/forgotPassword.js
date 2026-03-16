//  here is the forgot password controls

const UserModel = require("../Models/user-schema");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const bcrypt = require("bcrypt");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const forgotpassword = async (req, res) => {
  try {
    const {email} = req.body;

    const user = await UserModel.findOne({ email:email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not found", success: false });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    //   sendgrid
    await sgMail.send({
      from: process.env.SENDGRID_FROM,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
          <p>Valid for <strong>10 minutes</strong> only!</p>
          <p>If you didn't request this, ignore this email.</p>
        </div>  `,
    });
    res.json({ message: "OTP send to email", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "something went wrong", success: false });
  }
};

const otpverify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email:email.toLowerCase() });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not found", success: false });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    if (user.resetOTPExpiry < new Date()) {
      return res.status(400).json({ message: "OTP Expired", success: false });
    }

    res.json({ message: "OTP Verified", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "something went wrong", success: false });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { email, otp, newpassword } = req.body;

    const user = await UserModel.findOne({ email:email.toLowerCase() });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not found", success: false });
    }

    if (user.resetOTP !== otp || user.resetOTPExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }
    const hashpassword = await bcrypt.hash(newpassword, 10);

    user.password = hashpassword;
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    await user.save();

    res.json({ message: "Password Changed", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "something went wrong", success: false });
  }
};

module.exports = {
  forgotpassword,
  otpverify,
  resetpassword,
};
