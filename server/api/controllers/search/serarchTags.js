const Tag = require('../../models/tags');

exports.searchTags = (req, res) => {
  const q = req.query["term"].replace(/[^a-zA-Z0-9 ]/g, '');
  var regex = new RegExp(q, 'i');
  var query = Tag.find({name: regex}, { 'name': 1, 'count': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(7);

  query.exec(function(err, tags) {
    if (!err) {
      res.status(201).json({
        tags,
      });
    } else {
      res.status(404).json({
        error: 'an error occurred'
      });
    }
  });
};
