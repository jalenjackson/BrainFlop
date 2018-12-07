const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  },
  customizedTags: { type: String, required: true },
  name: { type: String, required: true },
  overallScore: { type: String, required: false, default: '0/0' },
  numberOfPerfectScores: { type: Number, required: false, default: 0 },
  points: { type: Number, required: false, default: 0 },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpiresIn: { type: Date, required: false }
});

module.exports = mongoose.model('User', userSchema);
