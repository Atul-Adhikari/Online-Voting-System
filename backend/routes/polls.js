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
  votePoll
} = require("../controllers/polls");

router.get("/", authMiddleware, getAllPolls);

router.get("/past", authMiddleware, getPastPolls);

router.get("/:id", authMiddleware, getPollID);

router.post("/vote", authMiddleware, votePoll);

router.post("/", authMiddleware, adminMiddleware, createPoll);

router.put("/:id", authMiddleware, adminMiddleware, updatePoll);

module.exports = router;