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

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
const dateOfBirthRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

//Register user
router.post("/register", registerUser);

//Login user
router.post("/login", loginUser);

router.get("/me", authMiddleware, getUser);

router.post("/status/:id", authMiddleware, adminMiddleware, changeStatus);

router.get("/all", authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;