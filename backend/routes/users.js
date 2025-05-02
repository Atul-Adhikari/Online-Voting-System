const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/isAdmin");
const {
  registerUser,
  loginUser,
  getUser,
  changeStatus,
  getAllUsers
} = require("../controllers/users");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", authMiddleware, getUser);

router.post("/status/:id", authMiddleware, adminMiddleware, changeStatus);

router.get("/all", authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;