const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
let token = '';

exports.facebookAuthentication = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result) {
        token = jwt.sign(
          {
            email: result.email,
            userId: result._id,
            name: result.name,
            customizedTags: result.customizedTags,
            overallScore: result.overallScore,
            numberOfPerfectScores: result.numberOfPerfectScores,
            points: result.points,
          },
          process.env.JWT_KEY
        );
        return res.status(201).json({
          token,
          email: result.email,
          userId: result._id,
          name: result.name,
          customizedTags: result.customizedTags,
          overallScore: result.overallScore,
          numberOfPerfectScores: result.numberOfPerfectScores,
          points: result.points,
        });
      }
      const user = new User({
        _id: mongoose.Types.ObjectId(),
        email: req.body.email,
        customizedTags: 'none',
        overallScore: '0/0',
        numberOfPerfectScores: 0,
        points: 0,
        name: req.body.name,
        password: generatePassword(),
      });
      return user.save()
        .then(() => {
          token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
              name: user.name,
              customizedTags: user.customizedTags,
              overallScore: user.overallScore,
              numberOfPerfectScores: user.numberOfPerfectScores,
              points: user.points,
              newUser: false
            },
            process.env.JWT_KEY
          );
        })
        .then(() => {
          res.status(201).json({
            userId: user._id,
            email: user.email,
            name: user.name,
            customizedTags: user.customizedTags,
            overallScore: user.overallScore,
            numberOfPerfectScores: user.numberOfPerfectScores,
            points: user.points,
            newUser: true,
            token,
          });
        })
        .catch((err) => {
          res.status(500).json({
            err,
          });
        });
    });
};

function generatePassword () {
  return Math.random().toString(36).slice(-8);
}
