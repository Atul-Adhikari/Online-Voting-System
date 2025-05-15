
const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/isAdmin");
const {
  getAllPolls,
  closePoll,
  createPoll,
  updatePoll,
  getPollID,
  getPastPolls,
  votePoll,
  deletePoll,
  publishPoll
} = require("../controllers/polls");

router.get("/", authMiddleware, getAllPolls);

router.get("/past", authMiddleware, getPastPolls);

router.get("/:id", authMiddleware, getPollID);

router.post("/vote", authMiddleware, votePoll);

router.post("/", authMiddleware, adminMiddleware, createPoll);

router.post("/:id/close", authMiddleware, adminMiddleware, closePoll);

router.patch("/:id/publish", authMiddleware, adminMiddleware, publishPoll);

router.put("/:id", authMiddleware, adminMiddleware, updatePoll);

router.delete("/:id", authMiddleware, adminMiddleware, deletePoll);

module.exports = router;