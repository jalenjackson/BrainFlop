const mongoose = require('mongoose');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
let userObject;

exports.updateUserAnalytics = (req, res) => {
  const id = req.body.userId;
  let points = req.body.points;
  const scoreFromGame = req.body.score ? req.body.score.split('/') : null;
  const isPerfectScore = req.body.isPerfectScore;
  let overallScore = null;
  User.findById(id)
    .exec()
    .then((user) => {
      if (user) {
        if (user.overallScore && req.body.score) {
          let userCurrentOverallScore = user.overallScore.split('/');
          let correct = Number(userCurrentOverallScore[0]) + Number(scoreFromGame[0]);
          let total = Number(userCurrentOverallScore[1]) + Number(scoreFromGame[1]);
          overallScore = String(correct) + '/' + String(total);
        } else if (!user.overallScore) {
          overallScore = String(Number(scoreFromGame[0])) + '/' + String(Number(scoreFromGame[1]));
        } else {
          overallScore = null
        }

        if (points || points === 0) {
          points = user.points
            ? user.points + points
            : points
        }


        const objectToSet = isPerfectScore
          ? { $inc: { numberOfPerfectScores: 1 } }
          : {$set: {overallScore, points}}

        User.findOneAndUpdate(
          {_id: user._id},
          objectToSet,
          {upsert: !!isPerfectScore, 'new': true},
          (err, user) => {
            if (err) throw err;
            const token = jwt.sign(
              {
                email: user.email,
                userId: user._id,
                name: user.name,
                customizedTags: user.customizedTags,
                overallScore: user.overallScore,
                numberOfPerfectScores: user.numberOfPerfectScores,
                points: user.points
              },
              process.env.JWT_KEY
            );
            res.status(201).json({
              message: 'Overall score updated',
              user: {
                email: user.email,
                userId: user._id,
                name: user.name,
                customizedTags: user.customizedTags,
                overallScore: user.overallScore,
                numberOfPerfectScores: user.numberOfPerfectScores,
                points: user.points
              },
              token
            });
          })
      } else {
        res.status(404).json({
          message: 'The user was not found',
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};
