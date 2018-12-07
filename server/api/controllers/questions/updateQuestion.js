const Question = require('../../models/questions');

exports.updateQuestion = (req, res) => {
  const id = req.params.questionId;
  Question.updateMany({ _id: id }, {
    $set: {
      question: req.body.question,
      answer1: req.body.answer1,
      answer2: req.body.answer2,
      answer3: req.body.answer3,
      answer4: req.body.answer4,
    },
  })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Question updated succesfully!',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
