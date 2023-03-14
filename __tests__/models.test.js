/* eslint-disable no-undef */
const { reviews, metadata } = require('../models');
const db = require('../db/index');

afterAll(() => {
  db.end();
});

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