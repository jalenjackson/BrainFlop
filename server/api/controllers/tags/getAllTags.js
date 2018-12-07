const Tag = require('../../models/tags');

exports.getAllTags = (req, res) => {
  Tag.find(({ count: { $gt: 3 } }))
    .skip(parseInt(req.query.skipAmount))
    .limit(parseInt(req.query.limit))
    .sort({ count: -1 })
    .exec()
    .then((tags) => {
      const response = {
        count: tags.length,
        tags: tags.map((tag) => {
          return {
            _id: tag._id,
            name: tag.name,
            count: tag.count,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};
