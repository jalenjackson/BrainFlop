const mongoose = require('mongoose');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const bcrypt = require('bcrypt');
let objectToSet = null;

exports.editUser = (req, res) => {

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
        if (!req.body.password) {
          hash = ''
        }
        const data = {
          name: req.body.name,
          email: req.body.email,
          password: hash
        }
        Object.keys(data).forEach((key) => (data[key] === '') && delete data[key]);
        User.findOneAndUpdate(
          { _id: req.body.userId },
          { $set: data },
          {upsert: true, 'new': true},
          (err, user) => {
            if (err) {
              return res.status(500).json({
                error,
              });
            }
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
              token,
              userObject: {
                email: user.email,
                userId: user._id,
                name: user.name,
                customizedTags: user.customizedTags,
                overallScore: user.overallScore,
                numberOfPerfectScores: user.numberOfPerfectScores,
                points: user.points
              }
            });
          },
        )
      })
    });
};
