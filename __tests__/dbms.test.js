const { reviews, metadata } = require('../models');
const db = require('../db/index');

// generate an id within the last 10% of a table
const generateRandomId = (table = 'products') => {
  let max = (table === 'products') ? 1000011 : 5774952;
  let min = Math.floor(max * 0.1);
  return Math.floor(Math.random() * (max - min) + min);
};

describe('random id generator', () => {
  it('should return an ID within the last 10% of the product ids', () => {
    for (let i = 0; i < 10000; i++) {
      let id = generateRandomId('products');
      let max = 1000011;
      let min = Math.floor(max * 0.1);
      expect(id).toBeGreaterThanOrEqual(min);
      expect(id).toBeLessThan(max)
    };
  });

  it('should return an ID within the last 10% of the reviews ids', () => {
    for (let i = 0; i < 10000; i++) {
      let id = generateRandomId('reviews');
      let max = 5774952;
      let min = Math.floor(max * 0.1);
      expect(id).toBeGreaterThanOrEqual(min);
      expect(id).toBeLessThan(max)
    }
  });
});

describe('reviews\' read queries', () => {
  it('should respond in less than 50ms',async () => {
    let start = performance.now();
    let end = await reviews.get(generateRandomId('products'))
    .then(() => {
      return performance.now();
    });
    let time = end - start;
    expect(time).toBeLessThan(50);
    console.log('reviews response time: ', time);
  });
});

describe('metadata\'s read queries', () => {
  it('should respond in less than 50ms', async () => {
    let start = performance.now();
    let end = await metadata.get(generateRandomId('reviews'))
    .then(() => {
      return performance.now();
    });
    let time = end - start;
    console.log('metadata response time: ', time);
    expect(time).toBeLessThan(50);
  });
});