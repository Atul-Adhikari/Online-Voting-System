const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/isAdmin");
const {
  registerUser,
  loginUser,
  getUser,
  changeStatus,
  getAllUsers,
  forgotPassword,
  resetPassword
} = require("../controllers/users");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get("/me", authMiddleware, getUser);

router.post("/status/:id", authMiddleware, adminMiddleware, changeStatus);

router.get("/all", authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;