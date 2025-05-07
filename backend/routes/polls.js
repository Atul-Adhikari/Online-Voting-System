const multer = require("multer");
const path = require("path");

// Configure storage location and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/isAdmin");
const {
  getAllPolls,
  createPoll,
  updatePoll,
  getPollID,
  getPastPolls,
  votePoll,
  deletePoll
} = require("../controllers/polls");

router.get("/", authMiddleware, getAllPolls);

router.get("/past", authMiddleware, getPastPolls);

router.get("/:id", authMiddleware, getPollID);

router.post("/vote", authMiddleware, votePoll);

router.post("/", authMiddleware, adminMiddleware, upload.array("images"), createPoll);//added

router.put("/:id", authMiddleware, adminMiddleware, updatePoll);

router.delete("/:id", authMiddleware, adminMiddleware, deletePoll);

module.exports = router;