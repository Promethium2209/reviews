const request = require('supertest');
const { app } = require('../app');

describe('GET /hello', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).get('/hello');
    expect(res.status).toBe(200);
  });

  it('should return a "Hello World!" message', async () => {
    const res = await request(app).get('/hello');
    expect(res.text).toBe('Hello World!');
  });
});

describe('GET /reviews', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).get('/reviews');
    expect(res.status).toBe(200);
  });

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



