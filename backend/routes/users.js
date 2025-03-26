const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

//Register user
router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!(fullName && email && password)) {
    return res.json("All fields required: fullName, email, password");
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
  try {
    const userExists = await User.findOne({ email: emailLowerCase });

    if (userExists) {
      return res.json({ error: "User already exists. Please login." });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName,
      email: emailLowerCase,
      password: encryptedPassword,
    });
    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      fullName,
      email,
      createdAt: user.createdAt,
      accessToken: token,
    });
  } catch (err) {
    return res.json(err);
  }
});

//Login user
router.post("/login", async (req, res) => {
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
});

module.exports = router;