const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");
const authMiddleware = require("../middleware/auth");
const {
  getAllPolls,
  createPoll,
  getPollID,
  votePoll
} = require("../controllers/polls");

router.get("/", authMiddleware, getAllPolls);

router.get("/:id", authMiddleware, getPollID);

router.post("/vote", authMiddleware, votePoll);

router.post("/", authMiddleware, createPoll);


module.exports = router;