/* eslint-disable no-undef */
const request = require('supertest');
const { app, server } = require('../app');
const { metadata } = require('../models');
const db = require('../db/index');

describe('GET /reviews', () => {
  it('should return a 200 status code when receive a valid request params', async () => {
    const res = await request(app).get('/reviews/?product_id=1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('product');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('count');
    expect(res.body).toHaveProperty('results');
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results[0]).toHaveProperty('review_id');
    expect(res.body.results[0]).toHaveProperty('rating');
    expect(res.body.results[0]).toHaveProperty('summary');
    expect(res.body.results[0]).toHaveProperty('recommend');
    expect(res.body.results[0]).toHaveProperty('response');
    expect(res.body.results[0]).toHaveProperty('body');
    expect(res.body.results[0]).toHaveProperty('date');
    expect(res.body.results[0]).toHaveProperty('reviewer_name');
    expect(res.body.results[0]).toHaveProperty('helpfulness');
    expect(res.body.results[0]).toHaveProperty('photos');
    expect(Array.isArray(res.body.results[0].photos)).toBe(true);
  });

  it('should return a 422 status code when receive a invalid request params', async () => {
    const res = await request(app).get('/reviews');
    expect(res.status).toBe(422);
    expect(res.text).toBe('Error: invalid product_id provided');
  });
});

describe('GET /reviews/meta', () => {
  it('should return a 200 status code and a correct data sh', async () => {

    let expectedResponse = await metadata.get(1);

    const res = await request(app).get('/reviews/meta/?product_id=1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expectedResponse);
  });

  it('should return a 422 status code when receive an invalid or non-existent request params', async () => {
    const res = await request(app).get('/reviews/meta');
    expect(res.status).toBe(422);
    expect(res.text).toBe('Error: invalid product_id provided');
  });
});

describe('POST /reviews', () => {

  // DELETE test samples FROM database
  afterAll(() => {
    return Promise.all([
      db.query(`DELETE FROM reviews_photos WHERE url = 'test url'`),
      db.query(`DELETE FROM characteristic_reviews WHERE value = 999`),
      db.query(`DELETE FROM reviews WHERE reviewer_name = 'reviewer'`)
    ]);
  });

  it('should return a 201 status code and add new data to database', async () => {
    const data = {
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
    };
    const res = await request(app).post('/reviews').send(data);
    const newReview = await db.query('SELECT * FROM reviews WHERE id = (SELECT MAX(id) FROM reviews)');
    const newPhotos = await db.query('SELECT * FROM reviews_photos WHERE url = \'test url\'');
    const newChars = await db.query('SELECT * FROM characteristic_reviews WHERE value = 999');
    expect(res.status).toBe(201);
    expect(res.text).toBe('Created');
    expect(newReview.rows[0].summary).toBe('bad product');
    expect(newPhotos.rows[0].url).toBe('test url');
    expect(newChars.rows[0].value).toBe(999);
  });

  it('should return a 422 status code when receive an invalid data', async () => {
    const res = await request(app).post('/reviews');
    expect(res.status).toBe(422);
    expect(res.text).toBe('Error: Review body contains invalid entries');
  });
});

describe('PUT /reviews/:review_id/helpful', () => {

  it('should return a 204 status code and update the data in database', async () => {
    const prePut = await db.query(`SELECT helpfulness FROM reviews WHERE id = 1`)
    .then(res => {
      return res.rows[0].helpfulness;
    });
    const res = await request(app).put('/reviews/1/helpful')
    expect(res.status).toBe(204);

    await db.query(`SELECT helpfulness FROM reviews WHERE id = 1`)
    .then(res => {
      let postPut = res.rows[0].helpfulness;
      expect(postPut).toBe(prePut + 1);
    })
    .finally(() => db.query(`UPDATE reviews SET helpfulness = ${prePut} WHERE id = 1`));
  });

  it('should return a 422 status code when provided an invalid review id', async () => {
    const res = await request(app).put('/reviews/notAnId/helpful');
    expect(res.status).toBe(422);
    expect(res.text).toBe('Error: invalid review id provided');
  });

});

describe('PUT /reviews/:review_id/report', () => {
  it('should return a 204 status code and update the data ind database', async () => {
    const prePut = await db.query(`SELECT reported FROM reviews WHERE id = 1`).
    then(res => {
      return res.rows[0].reported;
    });

    const res = await request(app).put('/reviews/1/report');
    expect(res.status).toBe(204);

    await db.query(`SELECT reported FROM reviews WHERE id = 1`)
    .then(res => {
      let postPut = res.rows[0].reported;
      expect(postPut).toBe(true);
    })
    .finally(() => db.query(`UPDATE reviews SET reported = ${prePut} WHERE id = 1`));
  });

  it('should return a 422 status code when provided an invalid review id', async () => {
    const res = await request(app).put('/reviews/notAnId/report');
    expect(res.status).toBe(422);
    expect(res.text).toBe('Error: invalid review id provided');
  });

});
