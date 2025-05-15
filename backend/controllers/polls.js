const Poll = require('../models/Poll');
const User = require('../models/User');
const mongoose = require('mongoose');

const createPoll = async (req, res) => {
  try {
    const { title, description, address, duration, options } = req.body;

    if (!title || !description || !options || options.length < 2) {
      return res.status(400).json({ message: "Poll must have a title, description, and at least 2 options." });
    }

    const poll = new Poll({ title, description, address, duration, options });
    await poll.save();

    res.status(201).json({ message: "Poll created successfully!", poll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updatePoll = async (req, res) => {
  try {
    const { title, description, duration, address, options, status } = req.body;

    if (!title || !description || !options || options.length < 2) {
      return res.status(400).json({ message: "Poll must have a title, description, and at least 2 options." });
    }

    const poll = await Poll.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          description,
          duration,
          address,
          options,
          status: status || "active"
        }
      },
      { new: true, runValidators: true }
    );

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.json({ message: "Poll updated successfully", poll });
  } catch (err) {
    console.error("Update poll error:", err);
    res.status(500).json({ message: err.message });
  }
};


const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    const now = Date.now();
    const updates = [];

    polls.forEach((poll) => {
      if (poll.status === "active") {
        const expirationTime = new Date(poll.createdAt).getTime() + poll.duration * 60 * 60 * 1000;
        if (now > expirationTime) {
          poll.status = "inactive";
          updates.push(poll.save());
        }
      }
    });

    if (updates.length > 0) await Promise.all(updates);
    const refreshedPolls = await Poll.find();
    res.json(refreshedPolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//added
const closePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    poll.status = "inactive";
    await poll.save();

    res.json({ message: "Poll closed manually", poll });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const votePoll = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;

    // Ensure Poll exists
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Ensure User exists
    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user has not already voted
    const alreadyVoted = poll.options.some(option => option.voters.includes(req.user_id));
    if (alreadyVoted) {
      return res.status(400).json({ message: "You have already voted on this poll!" });
    }

    // Check if user's address matches the poll's address
    const userAddress = user.address.trim().toLowerCase();
    const pollAddress = poll.address.trim().toLowerCase();
    if (userAddress !== pollAddress) {
      return res.status(403).json({ message: "You are not allowed to vote on the election of this address." });
    }

    // Find the selected option
    const selectedOption = poll.options.find(option => option._id.toString() === optionId);
    if (!selectedOption) {
      return res.status(404).json({ message: "Option not found" });
    }

    // Increment vote and add user to voters list
    selectedOption.votes += 1;
    selectedOption.voters.push(req.user_id);

    // Save the poll with the updated option
    await poll.save();

    res.json({ message: "Vote recorded successfully!", poll });
  } catch (error) {
    console.error("Error in votePoll:", error);
    res.status(500).json({ message: error.message });
  }
};


const getPollID = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    res.json({
      title: poll.title,
      description: poll.description,
      options: poll.options.map(option => ({
        name: option.name,
        imageUrl: option.imageUrl,
        votes: option.votes
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPastPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ status: "inactive" });

    const formattedPolls = polls.map(poll => {

      const maxVotes = Math.max(...poll.options.map(option => option.votes));
      const winner = poll.options.find(option => option.votes === maxVotes);

      return {
        title: poll.title,
        winner: winner ? winner.name : null,
        votes: winner ? winner.votes : 0,
        image: winner? winner.imageUrl: null,
        year: new Date(poll.createdAt).getFullYear()
      };
    }).filter(Boolean);

    res.json(formattedPolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id);
    
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    await Poll.findByIdAndDelete(id);
    res.json({ message: "Poll deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const publishPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (poll.status !== "completed" && poll.status !== "inactive") {
      return res.status(400).json({ message: "Only completed or inactive polls can be published." });
    }

    poll.isPublished = true;
    await poll.save();

    res.json({ message: "Poll result published", poll });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  createPoll,
  updatePoll,
  closePoll,
  getAllPolls,
  getPollID,
  getPastPolls,
  votePoll,
  deletePoll,
  publishPoll
};