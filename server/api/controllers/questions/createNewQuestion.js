const mongoose = require('mongoose');
const Question = require('../../models/questions');
const Quiz = require('../../models/quiz');

exports.createNewQuestion = (req, res) => {
  Quiz.findById(req.body.quizId)
    .then((quiz) => {
      if (!quiz) {
        return res.status(404).json({
          message: 'Quiz not found!',
        });
      }

      const questionImage = req.file ? req.file.location : 'none'

      const question = new Question({
        _id: mongoose.Types.ObjectId(),
        quiz: req.body.quizId,
        question: req.body.question,
        answer1: req.body.answer1,
        answer2: req.body.answer2,
        answer3: req.body.answer3,
        answer4: req.body.answer4,
        questionImage
      });
      return question.save();
    })
    .then((result) => {
      res.status(201).json({
        message: 'Question succesfully created!',
        createdQuestion: {
          _id: result._id,
          quiz: result.quiz,
          question: result.question,
          answer1: result.answer1,
          answer2: result.answer2,
          answer3: result.answer3,
          answer4: result.answer4,
          questionImage: result.questionImage
        },
        request: {
          type: 'GET',
          url: `http://localhost:3001/questions/${result._id}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
