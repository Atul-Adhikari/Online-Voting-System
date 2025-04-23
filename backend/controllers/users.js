const User = require('../models/User');
const mongoose = require('mongoose');

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
      return res.json(err);
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
    getAllUsers
};