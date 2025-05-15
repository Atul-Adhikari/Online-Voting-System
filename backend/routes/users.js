const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
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

router.post("/reset-password/:token", resetPassword);


router.get("/me", authMiddleware, getUser);

router.post("/status/:id", authMiddleware, adminMiddleware, changeStatus);

router.get("/all", authMiddleware, adminMiddleware, getAllUsers);

//added   
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;