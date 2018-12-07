const mongoose = require('mongoose');
const Question = require('../../models/questions');
const Quiz = require('../../models/quiz');

exports.createPersonalityQuestion = (req, res) => {
  if (!req.body.imageIncluded) {
    Quiz.findById(req.body.quizId)
        .then((quiz) => {
          if (!quiz) {
            return res.status(404).json({
              message: 'Quiz not found!',
            });
          }

          const question = new Question({
            _id: mongoose.Types.ObjectId(),
            quiz: req.body.quizId,
            personalityQuestion: req.body.question,
            personalityAnswers: req.body.allAnswers,
            questionImage: req.body.questionImage
          });
          return question.save();
        })
        .then((result) => {
          res.status(201).json({
            message: 'Question succesfully created!',
            question: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
  } else {
    res.status(200).json({
      questionImage: req.file.location
    })
  }
}
