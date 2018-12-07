const Quiz = require('../../models/quiz');

exports.getAllPersonalityQuizzes = (req, res) => {
  Quiz.find({ 'personalityResultsLength': { $gt: 1 } })
      .sort('-totalPlays')
      .skip(req.body.skipIterator)
      .limit(8)
      .exec()
      .then((quizzes) => {
        const response = {
          count: quizzes.length,
          quizzes: quizzes.filter((quiz) => {
            console.log(quiz)
            if (quiz && quiz._id) {
              return {
                _id: quiz._id,
                title: quiz.title,
                userId: quiz.userId,
                description: quiz.description,
                tags: quiz.tags,
                quizImage: quiz.quizImage,
                request: {
                  type: 'GET',
                  url: `http://localhost:3001/quizzes/${quiz._id}`,
                },
              };
            }
          }),
        };
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
};
