const { reviews } = require('../models');
const cache = require('../cache');

module.exports = {
  get: (req, res) => {
    let {product_id, sort, page, count} = req.query;

    reviews.get(product_id, sort, page, count)
    .then(reviews => {
      cache.set(req.url, JSON.stringify(reviews));
      res.json(reviews);
    })
    .catch(err => {
      console.error(err.stack);
      res.status(500).send('An error occurred. If this error persists, contact your instruction team.');
    });
  },

  post: (req, res) => {
    let data = req.body;

    reviews.add(data)
    .then(() => {
      res.status(201).send('Created');
    })
    .catch(err => {
      console.error(err.stack);
      res.status(500).send('An error occurred. If this error persists, contact your instruction team.');
    });
  },

  markHelpful: (req, res) => {
    let review_id = req.params.review_id;

    if (isNaN(review_id)) {
      res.status(422).send('Error: invalid review id provided');
      return;
    }

    reviews.markHelpful(review_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.log(err.stack);
      res.status(500).send('An error occurred. If this error persists, contact your instruction team.');
    });
  },

  report: (req, res) => {
    let review_id = req.params.review_id;
    if (isNaN(review_id)) {
      res.status(422).send('Error: invalid review id provided');
      return;
    }

    reviews.report(review_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.log(err.stack);
      res.status(500).send('An error occurred. If this error persisted, contact your instruction team.');
    });
  }
};