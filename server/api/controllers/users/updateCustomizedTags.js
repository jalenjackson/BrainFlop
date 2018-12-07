const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
let userObject;

exports.updateCustomizedTags = (req, res) => {
  User.findOneAndUpdate(
    { email: req.userData.email },
    { $set: { customizedTags: req.body.tags } },
    {upsert: true, 'new': true},
    (err, documents) => {
      userObject = documents;
      if (err) throw err;
    },
  )
    .exec()
    .then(() => {
      const token = jwt.sign(
        {
          email: userObject.email,
          userId: userObject._id,
          name: userObject.name,
          customizedTags: userObject.customizedTags,
          overallScore: userObject.overallScore,
          numberOfPerfectScores: userObject.numberOfPerfectScores,
          points: userObject.points
        },
        process.env.JWT_KEY
      );
      res.status(200).json({
        token,
        userObject: {
          email: userObject.email,
          userId: userObject._id,
          name: userObject.name,
          customizedTags: userObject.customizedTags,
          overallScore: userObject.overallScore,
          numberOfPerfectScores: userObject.numberOfPerfectScores,
          points: userObject.points
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
};
