const Quiz = require('../../models/quiz');

exports.retrieveQuiz = (req, res) => {
  const id = req.params.quizId;
  Quiz.findById(id)
    .select('-__v')
    .exec()
    .then((quiz) => {
      if (quiz) {
        // On Quiz Found
        res.status(200).json({
          quiz,
          request: {
            type: 'GET',
            description: 'Get all quizzes',
            url: 'http://localhost:3001/quizzes',
          },
        });
      } else {
        // When quiz was not found
        res.status(404).json({
          message: 'There was no quiz found with the provided ID',
        });
      }
    })
    .catch((error) => {
      // Error occured
      res.status(500).json({
        error,
      });
    });
};
