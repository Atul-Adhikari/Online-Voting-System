const User = require('../models/User');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
const dateOfBirthRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
  }
});
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailLowerCase = email.toLowerCase();
    if (!emailRegex.test(emailLowerCase)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const user = await User.findOne({ email: emailLowerCase });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.resetPasswordToken = resetToken;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
        <p>This link will expire in 1 hour</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!(token && newPassword)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error: "Please enter a secure password. A secure password contains: At least 8 characters, at least one number, and at least one special character"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.user_id,
      resetPasswordToken: token
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = encryptedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: "Invalid reset token" });
    }
    res.status(500).json({ error: "Error processing request" });
  }
};

const registerUser = async (req, res) => {
    const { fullName, email, password, address, phone, gender, dateOfBirth, nationalID } = req.body;
  
    if (!(fullName && email && password && address && phone && gender && dateOfBirth && nationalID)) {
      return res.json("All fields required: fullName, email, password, address, phone, gender, dateOfBirth, nationalID");
    }
  
    const emailLowerCase = email.toLowerCase();
    if (!emailRegex.test(emailLowerCase)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Please enter a secure password. A secure password contains: At least 8 characters, at least one number, and at least one special character",
      });
    }
  
    if (!dateOfBirthRegex.test(dateOfBirth)) {
      return res.status(400).json({ error: "Please enter a valid date of birth in YYYY-MM-DD format" });
    }
  
    try {
      const userExists = await User.findOne({ email: emailLowerCase });
  
      if (userExists) {
        return res.json({ error: "User already exists. Please login." });
      }
  
      const encryptedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        fullName,
        email: emailLowerCase,
        password: encryptedPassword,
        address,
        phone,
        gender,
        dateOfBirth,
        nationalID
      });
      const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      return res.json({
        fullName,
        email,
        address,
        phone,
        gender,
        dateOfBirth,
        createdAt: user.createdAt,
        accessToken: token,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

const loginUser =  async (req, res) => {
    const { email, password } = req.body;
  
    if (!(email && password)) {
      return res.json({ error: "Email or password not provided." });
    }
  
    const user = await User.findOne({ email });
  
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.json({ fullName: user.fullName, email, accessToken: token });
    } else {
      return res.json({ error: "Incorrect email address or password" });
    }
  }

const getUser = async (req, res) => {
    try {
      const user = await User.findById(req.user_id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
}

const changeStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.status = !user.status;
      await user.save();
      return res.json({ 
        message: user.status ? "User activated successfully!" : "User deactivated successfully!",
        status: user.status
      });
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password");
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  }

module.exports = {
    registerUser,
    loginUser,
    getUser,
    changeStatus,
    getAllUsers,
    forgotPassword,
    resetPassword
};