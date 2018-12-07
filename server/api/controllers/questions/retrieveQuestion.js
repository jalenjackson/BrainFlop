const Question = require('../../models/questions');

exports.retrieveQuestion = (req, res) => {
  Question.findById(req.params.questionId)
    .exec()
    .then((question) => {
      if (!question) {
        return res.status(404).json({
          message: 'Question not found!',
        });
      }
      return res.status(200).json({
        question,
        request: {
          type: 'GET',
          url: 'http://localhost:3001/questions',
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};
