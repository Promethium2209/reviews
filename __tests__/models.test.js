/* eslint-disable no-undef */
const { reviews, metadata } = require('../models');
const db = require('../db/index');

describe('reviews\' get', () => {
  it('should return the expected shape for reviews', (done) => {
    reviews.get(100)
    .then(res => {
      expect(res).toHaveProperty('product');
      expect(res).toHaveProperty('page');
      expect(res).toHaveProperty('count');
      expect(res).toHaveProperty('results');
      expect(Array.isArray(res.results)).toBe(true);
      expect(res.results[0]).toHaveProperty('review_id');
      expect(res.results[0]).toHaveProperty('rating');
      expect(res.results[0]).toHaveProperty('summary');
      expect(res.results[0]).toHaveProperty('recommend');
      expect(res.results[0]).toHaveProperty('response');
      expect(res.results[0]).toHaveProperty('body');
      expect(res.results[0]).toHaveProperty('date');
      expect(res.results[0]).toHaveProperty('reviewer_name');
      expect(res.results[0]).toHaveProperty('helpfulness');
      expect(res.results[0]).toHaveProperty('photos');
      expect(Array.isArray(res.results[0].photos)).toBe(true);
      done();
    })
    .catch(err => {
      console.error(err.stack);
    })
  });
});

describe('reviews\' add', () => {
  it('should add a new row to reviews table, new row in photos', (done) => {
    let review = {
      product_id: 1,
      rating: 1,
      summary: 'bad product',
      body: 'the product is bad',
      recommend: false,
      name: 'reviewer',
      email: 'reviewer@review.com',
      photos: ['test url', 'test url'],
      characteristics: {
        "14": 999,
        "15": 999
      }
    }
    reviews.add(review)
    .then(() => {
      return db.query('SELECT * FROM reviews ORDER BY id DESC LIMIT 1');
    })
    .then(r => {
      let res = r.rows[0];
      expect(res.product_id).toBe(1);
      expect(res.rating).toBe(1);
      expect(res.summary).toBe('bad product');
      expect(res.body).toBe('the product is bad');
      expect(res.recommend).toBe(false);
      expect(res.reviewer_name).toBe('reviewer');
      expect(res.reviewer_email).toBe('reviewer@review.com');
      expect(isNaN(res.date)).toBe(false);
      expect(res.helpfulness).toBe(0);
      expect(res.reported).toBe(false);
      expect(res.response).toBeNull();
      return db.query(`SELECT * FROM reviews_photos WHERE review_id = ${res.id}`);
    })
    .then(r => {
      let res = r.rows;
      expect(res[0].url).toBe('test url');
      expect(res[1].url).toBe('test url');
      return db.query(`SELECT * FROM characteristic_reviews WHERE review_id = ${res[0].review_id}`);
    })
    .then(r => {
      let res = r.rows;
      expect(res[0].characteristic_id).toBe(14);
      expect(res[0].value).toBe(999);
      expect(res[1].characteristic_id).toBe(15);
      expect(res[1].value).toBe(999);

      return Promise.all([
        db.query(`DELETE FROM reviews_photos WHERE url = 'test url'`),
        db.query(`DELETE FROM characteristic_reviews WHERE value = 999`)
      ]);
    })
    .then(() => {
      return db.query(`DELETE FROM reviews WHERE reviewer_name = 'reviewer'`);
    })
    .then(() => {
      done();
    })
    .catch(err => {
      console.error(err.stack);
    });
  });
});

describe('reviews\' markHelpful', () => {
  it('should increment the helpfulness value of a review by 1 given a review id', async () => {
    let review_id = 1;
    let queryString = `SELECT helpfulness FROM reviews WHERE id = ${review_id}`;
    let preUpdated = await db.query(queryString)
    .then(res => {
      return res.rows[0].helpfulness;
    });

    await reviews.markHelpful(review_id)
    .then(() => {
      return db.query(queryString);
    })
    .then(res => {
      let postUpdated = res.rows[0].helpfulness;
      expect(postUpdated).toEqual(preUpdated + 1);
    })
    .then(() => {
      return db.query(`UPDATE reviews SET helpfulness = ${preUpdated} WHERE id = ${review_id}`);
    })
    .catch(err => {
      console.log(err.stack);
    });
  });
});

describe('reviews\' report', () => {
  it('should update the report value of a review to true when given a review id', (done) => {
    let review_id = 1;

    reviews.report(review_id)
    .then(() => {
      return db.query(`SELECT reported FROM reviews WHERE id = ${review_id}`);
    })
    .then(res => {
      let reported = res.rows[0].reported;
      expect(reported).toBe(true);
      return db.query(`UPDATE reviews SET reported = false WHERE id = ${review_id}`);
    })
    .then(() => {
      done();
    })
    .catch(err => {
      console.log(err.stack);
    });
  });
});

describe('metadata\' get', () => {
  it('should return the expected shape of metadata', (done) => {
    metadata.get(100)
    .then(response => {
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('product_id');
      expect(response).toHaveProperty('ratings');
      expect(response).toHaveProperty('recommended');
      expect(response).toHaveProperty('characteristics');
      expect(typeof response.ratings).toBe('object');
      expect(typeof response.recommended).toBe('object');
      expect(typeof response.characteristics).toBe('object');
      done();
    })
    .catch(err => {
      console.error(err.stack);
    });
  });

  it('should return the same shape even if the product_id doesnot exist', (done) => {
    metadata.get(99999999)
    .then(response => {
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('product_id');
      expect(response).toHaveProperty('ratings');
      expect(response).toHaveProperty('recommended');
      expect(response).toHaveProperty('characteristics');
      expect(typeof response.ratings).toBe('object');
      expect(typeof response.recommended).toBe('object');
      expect(typeof response.characteristics).toBe('object');
      done();
    })
    .catch(err => {
      console.error(err.stack);
    });
  });

  it('should return the expected shape with an empty array result when given a nonx-existent product', (done) => {
    reviews.get(99999999)
    .then(res => {
      expect(res).toHaveProperty('product');
      expect(res).toHaveProperty('page');
      expect(res).toHaveProperty('count');
      expect(res).toHaveProperty('results');
      expect(res.results).toEqual([]);
      done();
    });
  });

  it('should throw an error if query fails', (done) => {
    reviews.get('aaa')
    .catch(err => {
      expect(err.message).toBe('column "aaa" does not exist');
      done();
    })
  });
});