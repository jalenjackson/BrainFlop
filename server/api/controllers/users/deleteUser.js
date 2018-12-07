const User = require('../../models/user');

exports.deleteUser = (req, res) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'User successfully deleted!',
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
};
