const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  question: { type: String, required: false },
  answer1: { type: String, required: false },
  answer2: { type: String, required: false },
  answer3: { type: String, required: false },
  answer4: { type: String, required: false },
  questionImage: { type: String, required: false },

  personalityQuestion: { type: String, required: false },
  personalityAnswers: { type: Array, required: false }
});

module.exports = mongoose.model('Question', questionSchema);
