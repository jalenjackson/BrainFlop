const mongoose = require('mongoose');
const User = require('../../models/user');
const Quiz = require('../../models/quiz');
const Tag = require('../../models/tags');
const _ = require('underscore');

exports.createNewQuiz = (req, res) => {
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
      res.status(201).json({
        message: 'Created quiz successfully!',
        createdQuiz: {
          _id: result._id,
          title: result.title,
          description: result.description,
          userId: result.userId,
          tags: result.tags,
          quizImage: result.quizImage,
          request: {
            type: 'GET',
            url: `http://localhost:3001/quizzes/${result._id}`,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
