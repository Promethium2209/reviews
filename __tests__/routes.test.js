const request = require('supertest');
const { app, server } = require('../app');

afterAll(() => {
  server.close();
});


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
  })
});

describe('GET /reviews/meta', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).get('/reviews/meta');
    expect(res.status).toBe(200);
  });

});

describe('POST /reviews', () => {
  it('should return a 201 status code', async () => {
    const res = await request(app).post('/reviews');
    expect(res.status).toBe(201);
  });

});

describe('PUT /reviews/:review_id/helpful', () => {
  it('should return a 204 status code', async () => {
    const res = await request(app).put('/reviews/1/helpful');
    expect(res.status).toBe(204);
  });

});

describe('PUT /reviews/:review_id/report', () => {
  it('should return a 204 status code', async () => {
    const res = await request(app).put('/reviews/1/report');
    expect(res.status).toBe(204);
  });

});
