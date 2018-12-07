const Question = require('../../models/questions');

exports.searchQuestions = (req, res) => {
  const q = req.query["term"].replace(/[^a-zA-Z0-9 ]/g, '');
  var regex = new RegExp(q, 'i');
  var query = Question.find({question: regex}, { 'question': 1, 'answer1': 1, 'answer2': 1, 'answer3': 1, 'answer4': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

  query.exec(function(err, questionsFound) {
    if (!err) {
      res.status(201).json({
        questionsFound,
      });
    } else {
      res.status(404).json({
        error: 'an error occurred'
      });
    }
  });
};
