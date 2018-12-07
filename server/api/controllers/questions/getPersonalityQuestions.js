const Question = require('../../models/questions');

exports.getPersonalityQuestions = (req, res) => {
  Question.find({ quiz: { $eq: req.body.quizId } })
      .select('-__v')
      .exec()
      .then((questions) => {

        res.status(200).json({
          questions: shuffle(questions).map((question) => {
            return {
              _id: question._id,
              quiz: question.quiz,
              personalityQuestion: question.personalityQuestion,
              personalityAnswers: question.personalityAnswers,
              questionImage: question.questionImage
            };
          }),
        });
      })
      .catch((error) => {
        res.status(500).json({
          error,
        });
      });
}


function shuffle (a) {
  let j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}
