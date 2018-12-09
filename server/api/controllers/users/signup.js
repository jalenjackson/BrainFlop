const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result) {
        return res.status(409).json({
          message: 'Email already exists',
        });
      }
      return bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json({
            error,
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
          password: hash,
        });
        let token = '';
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
              token,
            });
          })
          .catch((err) => {
            res.status(500).json({
              err,
            });
          });
      });
    });
};
