const Quiz = require('../../models/quiz');
const User = require('../../models/user');

exports.getAllUserQuizzes = (req, res) => {
  Quiz.find({ 'userId': req.body.userId })
    .skip(req.body.skipIterator)
    .limit(8)
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
