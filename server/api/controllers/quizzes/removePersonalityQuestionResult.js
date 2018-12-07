const mongoose = require('mongoose');
const Question = require('../../models/questions');
const Quiz = require('../../models/quiz');

exports.removePersonalityQuestionResult = (req, res) => {
  const id = req.body.quizId
  Quiz.findById(id)
      .exec()
      .then((quiz) => {
        if (quiz) {
          const personalityResults = quiz.personalityResults
          let tmpArray = personalityResults.filter((result) => {
            return result.id !== req.body.resultId
          })

          Quiz.updateOne(
              { _id: id },
              { $set: { personalityResults: tmpArray } },
              {upsert: true, 'new': true},
              (err, quiz) => {
                if (err) throw err;
                res.status(200).json({
                  message: 'done'
                })
              },
          )
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
}
