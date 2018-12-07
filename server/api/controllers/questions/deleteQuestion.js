const Question = require('../../models/questions');

exports.deleteQuestion = (req, res) => {
  Question.deleteOne({ _id: req.params.questionId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Question successfully deleted!',
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};