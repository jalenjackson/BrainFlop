const Quiz = require('../../models/quiz');

exports.updateQuiz = (req, res) => {
  const id = req.params.quizId;

  Quiz.updateMany({_id: id}, {
    $set: {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
    },
  })
    .exec()
    .then((res) => {
      res.status(200).json({
        message: 'Quiz updated succesfully!',
        request: {
          type: 'GET',
          url: `http://localhost:3001/quizzes/${id}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
