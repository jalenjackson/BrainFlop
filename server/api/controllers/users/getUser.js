const User = require('../../models/user');

exports.getUser = (req, res) => {
  const id = req.body.userId;
  User.findById(id)
    .exec()
    .then((user) => {
      if (user) {
        // On Quiz Found
        res.status(200).json({
          user,
        });
      } else {
        // When quiz was not found
        res.status(404).json({
          message: 'There was no user found with the provided ID',
        });
      }
    })
    .catch((error) => {
      // Error occured
      res.status(500).json({
        error,
      });
    });
};
