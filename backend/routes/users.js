const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
const dateOfBirthRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

//Register user
router.post("/register", async (req, res) => {
  const { fullName, email, password, address, phone, gender, dateOfBirth } = req.body;

  if (!(fullName && email && password && address && phone && gender && dateOfBirth)) {
    return res.json("All fields required: fullName, email, password, address, phone, gender, dateOfBirth");
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

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user_id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;