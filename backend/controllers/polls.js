const Poll = require('../models/Poll');
const User = require('../models/User');
const mongoose = require('mongoose');

const createPoll = async (req, res) => {
  try {
    const { title, description, address, options } = req.body;

    if (!title || !description || !options || options.length < 2) {
      return res.status(400).json({ message: "Poll must have a title, description, and at least 2 options." });
    }

    const poll = new Poll({ title, description, address, options });
    await poll.save();

    res.status(201).json({ message: "Poll created successfully!", poll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const votePoll = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;

    const poll = await Poll.findById(pollId);
    const user = await User.findById(req.user_id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const alreadyVoted = poll.options.some(option => option.voters.includes(req.user_id));
    if (alreadyVoted) {
      return res.status(400).json({ message: "You have already voted on this poll!" });
    }
    
    userAddress = user.address
    pollAddress = poll.address
    if (userAddress.toLowerCase() !== pollAddress.toLowerCase()) {
      return res.status(403).json({ message: "You are not allowed to vote on the election of this address." });
    }

    const timeElapsed = Date.now() - poll.createdAt;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (timeElapsed > twentyFourHours) {
      return res.status(400).json({ message: "Voting period has ended!" });
    }

    const selectedOption = poll.options.id(optionId);
    if (!selectedOption) return res.status(404).json({ message: "Option not found" });

    selectedOption.votes += 1;
    selectedOption.voters.push(req.user_id);

    await poll.save();
    res.json({ message: "Vote recorded successfully!", poll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPollID = async (req, res) => {
  try {
    const { pollId } = req.params;
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    res.json({
      title: poll.title,
      description: poll.description,
      options: poll.options.map(option => ({
        name: option.name,
        votes: option.votes
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createPoll,
  getAllPolls,
  getPollID,
  votePoll
};