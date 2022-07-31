import { randomizeDate, rnormWithHalfRange } from '../../lib/cron/randomize.js';


describe('Randomize date', () => {
  const MINUTE = 60 * 1000;
  const referenceDate = new Date(100000 * MINUTE);
  const min = 99900 * MINUTE;
  const max = 100100 * MINUTE;
  
  it('Fixed', () => {
    const result = randomizeDate(referenceDate, 'fixed');
    expect(result).toEqual(referenceDate);
  });
  
  it('Normal', () => {
    for(let i = 0; i < 100; i++){
      const result = randomizeDate(referenceDate, 'normal', 100);
      //console.log(result);
      
      expect(result.getTime()).toBeGreaterThanOrEqual(min);
      expect(result.getTime()).toBeLessThan(max);
    }
  });
  
  it('Uniform', () => {
    for(let i = 0; i < 100; i++){
      const result = randomizeDate(referenceDate, 'uniform', 100);
      //console.log(result);
      
      expect(result.getTime()).toBeGreaterThanOrEqual(min);
      expect(result.getTime()).toBeLessThan(max);
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