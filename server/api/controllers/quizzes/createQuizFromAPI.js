const mongoose = require('mongoose');
const User = require('../../models/user');
const Quiz = require('../../models/quiz');
const Question = require('../../models/questions');
const Tag = require('../../models/tags');
const _ = require('underscore');
const request = require('request');

exports.createNewQuizFromAPI = (req, res) => {
  let questions = null;

  const tags = req.body.tags.split(',');

  Tag.find({ name: { $in: tags } })
    .then((foundTags) => {
      tags.map((tag) => {
        let check = foundTags => foundTags.name === tag;
        if (!foundTags.some(check)) {
          const newTag = new Tag({
            _id: new mongoose.Types.ObjectId(),
            referenceId: new mongoose.Types.ObjectId(),
            name: tag,
            count: 1,
          });
          return newTag.save();
        }
      });

      foundTags.map((foundTag) => {
        return Tag.updateOne(
          { _id: foundTag._id },
          { $set: { count: foundTag.count + 1 } },
          (err) => {
            if (err) throw err;
          },
        );
      });
    });

  User.findById(req.body.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'User not found!',
        });
      }
      const quiz = new Quiz({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        quizImage: req.file.location,
      });
      return quiz.save();
    })
    .then((result) => {
      request(req.body.questionAPI, (error, response, body) => {
        questions = JSON.parse(body).results;

        for (var i = 0; i < questions.length; i++) {
          const question = new Question({
            _id: mongoose.Types.ObjectId(),
            quiz: result._id,
            question: questions[i].question,
            answer1: questions[i].correct_answer,
            answer2: questions[i].incorrect_answers[0],
            answer3: questions[i].incorrect_answers[1],
            answer4: questions[i].incorrect_answers[2],
            questionImage: 'none'
          });
          question.save();
        }
      });
    })
    .then(() => {
      res.status(201).json({
        message: 'done',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
