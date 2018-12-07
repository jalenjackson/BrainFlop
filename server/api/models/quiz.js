const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: String, required: true },
  quizImage: { type: String, required: true },
  totalPlays: { type: Number, required: false, default: 1 },
  totalViews: { type: Number, required: false },
  rating: { type: String, required: false },
  personalityResults: { type: Array, required: false },
  personalityResultsLength: { type: Number, required: false }
});

module.exports = mongoose.model('Quiz', quizSchema);
