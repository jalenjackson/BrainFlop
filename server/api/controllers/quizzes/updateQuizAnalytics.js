const Quiz = require('../../models/quiz');

exports.updateQuizAnalytics = (req, res) => {
  const id = req.params.quizId;
  // total plays
  Quiz.findByIdAndUpdate(id, { $inc: { totalPlays: 1 }}, {upsert: true, 'new': true}, function(err, data){
    if (!err) {
      res.status(200).json({
        data,
        message: 'Quiz updated succesfully!',
        request: {
          type: 'GET',
          url: `http://localhost:3001/quizzes/${id}`,
        },
      });
    } else {
      res.status(401).json({
        err
      })
    }
  })
};
