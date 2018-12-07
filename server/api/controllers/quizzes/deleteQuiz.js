const Quiz = require('../../models/quiz');

exports.deleteQuiz = (req, res) => {
  const id = req.params.quizId;
  Quiz.deleteOne({ _id: id }).exec().then(() => {
    res.status(200).json({
      message: 'Quiz was succesfully deleted!',
      request: {
        type: 'POST',
        url: 'http://localhost:3001/quizzes',
      },
    });
  }).catch((error) => {
    res.status(500).json({
      error,
    });
  });
};
