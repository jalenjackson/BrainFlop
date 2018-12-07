const Quiz = require('../../models/quiz');

exports.getAllFeaturedQuizzes = (req, res) => {
  Quiz.find(({ 'personalityResults': { $exists: false } }))
    .sort('-totalPlays')
    .skip(Number(req.query.skip))
    .limit(Number(req.query.limit))
    .exec()
    .then((quizzes) => {
      const response = {
        count: quizzes.length,
        quizzes: quizzes.map((quiz) => {
          return {
            _id: quiz._id,
            title: quiz.title,
            userId: quiz.userId,
            description: quiz.description,
            tags: quiz.tags,
            quizImage: quiz.quizImage,
            totalPlays: quiz.totalPlays,
            request: {
              type: 'GET',
              url: `http://localhost:3001/quizzes/${quiz._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};
