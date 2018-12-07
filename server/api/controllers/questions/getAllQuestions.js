const Question = require('../../models/questions');
const he = require('he')
const readingTime = require('reading-time');
let filteredQuestions = null;

exports.getAllQuestions = (req, res) => {
  Question.find({ quiz: { $eq: req.body.quizId } })
    .select('-__v')
    .exec()
    .then((questions) => {
      req.body.usingForEdit
      ? filteredQuestions = questions
      : filteredQuestions = shuffle(questions).splice(0, 10);
      res.status(200).json({
        count: questions.length,
        questions: filteredQuestions.map((question) => {
          return {
            _id: question._id,
            quiz: question.quiz,
            question: he.decode(question.question),
            answer1: he.decode(question.answer1),
            answer2: he.decode(question.answer2),
            answer3: he.decode(question.answer3),
            answer4: he.decode(question.answer4),
            questionImage: question.questionImage,
            timeToRead: readingTime(question.question).time,
            request: {
              type: 'GET',
              url: `http://localhost:3001/questions/${question._id}`,
            },
          };
        }),
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};

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
