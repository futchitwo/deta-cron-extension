const { randomizeDate, rnormWithHalfRange } = require('../../lib/cron/randomize.js');

describe('Randomize date', () => {
  const referenceDate = new Date(100000);
  
  it('Fixed', () => {
    const result = randomizeDate(referenceDate, 'fixed');
    expect(result).toEqual(referenceDate);
  });
  
  it('Normal', () => {
    for(let i = 0; i < 100; i++){
      const result = randomizeDate(referenceDate, 'normal', 100);
      //console.log(result);
      
      expect(result.getTime()).toBeGreaterThanOrEqual(99900);
      expect(result.getTime()).toBeLessThan(100100);
    }
  });
  
  it('Uniform', () => {
    for(let i = 0; i < 100; i++){
      const result = randomizeDate(referenceDate, 'uniform', 100);
      //console.log(result);
      
      expect(result.getTime()).toBeGreaterThanOrEqual(99900);
      expect(result.getTime()).toBeLessThan(100100);
    }
  });
  
  it('Invalid type', () => {
    expect(
      () => randomizeDate(referenceDate, 'honi', 100)
    ).toThrow('Cron type "honi" is invalid');
  });
  
});

describe('Rnorm with half range', () => {
  it('-50, 50', () => {
    for(let i = 0; i < 100; i++){
      const result = rnormWithHalfRange(50);
      //console.log(result);
      
      expect(result).toBeGreaterThanOrEqual(-50);
      expect(result).toBeLessThan(50);
    }
  });
  
  it('-5, 5', () => {
    for(let i = 0; i < 100; i++){
      const result = rnormWithHalfRange(5);
      //console.log(result);
      
      expect(result).toBeGreaterThanOrEqual(-5);
      expect(result).toBeLessThan(5);
    }
  });
});