const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  duration: { type: Number, required: true },
  status: { type: String, default: "active" },
  isPublished: { type: Boolean, default: false }, 
  options: [
    {
      name: { type: String, required: true },
      votes: { type: Number, default: 0 },
      imageUrl: { type: String },
      voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;
