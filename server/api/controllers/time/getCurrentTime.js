const moment = require('moment');

exports.getCurrentTime = (req, res) => {
  res.status(200).json({ time: moment().calendar() });
};
