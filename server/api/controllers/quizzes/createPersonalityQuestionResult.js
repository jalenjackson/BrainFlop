const mongoose = require('mongoose');
const Question = require('../../models/questions');
const Quiz = require('../../models/quiz');

exports.createPersonalityQuestionResult = (req, res) => {
  const _id = req.body.quizId;

  Quiz.findOneAndUpdate(
      { _id },
      { $push: {'personalityResults': {id: req.body.referenceId, title: req.body.title }}},
      {upsert: true, 'new': true},
      (err, quiz) => {
        //console.log(quiz)
      }
  )

  res.status(200).json({
    message: 'done'
  })
}
