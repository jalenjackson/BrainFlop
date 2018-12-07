var User = require('../../models/user');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

exports.forgotPaswordChange = (req, res) => {
  User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpiresIn: { $gt: Date.now() } }, function(err, user) {

    if (!user) {
      return res.status(404).json({
        message: 'Password reset token is invalid or expired'
      })
    }

    return bcrypt.hash(req.body.password, 10, (error, hash) => {
      if (error) {
        return res.status(500).json({
          error,
        });
      }

      var data = { password: hash };

      User.findOneAndUpdate(
        { _id: user._id },
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
            user,
            token
          });
        },
      )
    })
  });
};