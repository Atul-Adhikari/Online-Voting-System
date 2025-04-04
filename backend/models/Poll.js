const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, default: "active" },
  options: [
    {
      name: { type: String, required: true },
      votes: { type: Number, default: 0 },
      voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;
