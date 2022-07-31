//import { describe, it, expect } from 'vitest';
import { generateIterator, parseCronPart, generateDoWIterator } from '../../lib/cron/baseTime.js';

describe('Parse Cron Part', () => {
  const defaultTestSetting = { min:1, max:7 };
  
  it('One', () => {
    const result = parseCronPart('1', defaultTestSetting)
    expect(result).toEqual([1])
  })
  
  it('All', () => {
    const result = parseCronPart('*', defaultTestSetting)
    expect(result).toEqual([1,2,3,4,5,6,7])
  })

  it('Range', () => {
    const result = parseCronPart('1-3', defaultTestSetting)
    expect(result).toEqual([1,2,3])
  })
  
  it('Multiple', () => {
    const result = parseCronPart('1,3', defaultTestSetting)
    expect(result).toEqual([1,3])
  })

  it('every', () => {
    const result = parseCronPart('2/2', { min:0, max:7 })
    expect(result).toEqual([2,4,6])
  })
  
  it('every with range', () => {
    const result = parseCronPart('1-5/2', { min:0, max:7 })
    expect(result).toEqual([2,4])
  })

  it('every (starts from 1)', () => {
    const result = parseCronPart('2/2', { min:1, max:7 })
    expect(result).toEqual([2,4,6])
  })
  
  it('every with range (starts from 1)', () => {
    const result = parseCronPart('1-5/2', { min:1, max:7 })
    expect(result).toEqual([2,4])
  })

  it('Preprocessor', () => {
    const result = parseCronPart('SUN,MON,TUE,WED,THU,FRI,SAT', {
      ...defaultTestSetting,
      preprocessor(cronDoW){
        return cronDoW
          .replaceAll('L', '7')
          .replaceAll('SUN', '1')
          .replaceAll('MON', '2')
          .replaceAll('TUE', '3')
          .replaceAll('WED', '4')
          .replaceAll('THU', '5')
          .replaceAll('FRI', '6')
          .replaceAll('SAT', '7')
      },
    })
    expect(result).toEqual([1,2,3,4,5,6,7])
  })


  it('Wrong convination', () => {
    expect(
      () => parseCronPart('*/8', defaultTestSetting)
    ).toThrow('"NaN" is not Integer');
  })

  it('Out of range', () => {
    expect(
      () => parseCronPart('9', defaultTestSetting)
    ).toThrow('"9" is out of range between 1 - 7');
  })
})

describe('DoW Iterator', () => {
  it('Same day', () => {
    const now = new Date('Jan 2 2022 00:00:00');
    const itr = generateDoWIterator(['0', '0', '?', '*', '1'], now);
    expect(itr.next().value).toEqual(new Date('Jan 2 2022 00:00:00'));
  });

  it('Not same day', () => {
    const now = new Date('Jan 2 2022 00:00:00');
    const itr = generateDoWIterator(['0', '0', '?', '*', '3'], now);
    expect(itr.next().value).toEqual(new Date('Jan 4 2022 00:00:00'));
  });

  it('Next day', () => {
    const now = new Date('Jan 2 2022 00:00:00');
    const itr = generateDoWIterator(['0', '0', '?', '*', '1,2'], now);
    itr.next();
    expect(itr.next().value).toEqual(new Date('Jan 3 2022 00:00:00'));
  });
  
  it('Next week', () => {
    const now = new Date('Jan 2 2022 00:00:00');
    const itr = generateDoWIterator(['0', '0', '?', '*', '1'], now);
    itr.next();
    expect(itr.next().value).toEqual(new Date('Jan 9 2022 00:00:00'));
  });

  it('Start from middle of the week', () => {
    const now = new Date('Jan 8 2022 00:00:00');
    const itr = generateDoWIterator(['0', '0', '?', '*', '*'], now);
    itr.next();
    expect(itr.next().value).toEqual(new Date('Jan 9 2022 00:00:00'));
  });
  
});

describe('Iterator', () => {
  it('Minute', () => {
    const result = [];
    const now = new Date('Jan 8 2022 00:00:00');
    const itr = generateIterator(['10','*','?','*','*'], now);
    for(let i = 0; i < 6; i++){
      result.push(itr.next().value);
    }
    expect(result).toEqual([
      new Date('Jan 8 2022 00:10:00'),
      new Date('Jan 8 2022 01:10:00'),
      new Date('Jan 8 2022 02:10:00'),
      new Date('Jan 8 2022 03:10:00'),
      new Date('Jan 8 2022 04:10:00'),
      new Date('Jan 8 2022 05:10:00'),
    ]);
  });
  
  it('Minute just', () => {
    const result = [];
    const now = new Date('Jan 8 2022 00:10:00');
    const itr = generateIterator(['10','*','?','*','*'], now);
    for(let i = 0; i < 6; i++){
      result.push(itr.next().value);
    }
    expect(result).toEqual([
      new Date('Jan 8 2022 01:10:00'),
      new Date('Jan 8 2022 02:10:00'),
      new Date('Jan 8 2022 03:10:00'),
      new Date('Jan 8 2022 04:10:00'),
      new Date('Jan 8 2022 05:10:00'),
      new Date('Jan 8 2022 06:10:00'),
    ]);
  });
  
  it('Hour', () => {
    const result = [];
    const now = new Date('Jan 8 2022 00:00:00');
    const itr = generateIterator(['10','0/8','?','*','*'], now);
    
    for(let i = 0; i < 6; i++){
      result.push(itr.next().value);
    }
    expect(result).toEqual([
      new Date('Jan  8 2022 00:10:00'),
      new Date('Jan  8 2022 08:10:00'),
      new Date('Jan  8 2022 16:10:00'),
      new Date('Jan  9 2022 00:10:00'),
      new Date('Jan  9 2022 08:10:00'),
      new Date('Jan  9 2022 16:10:00'),
    ]);
  });
  
  it('Hour just', () => {
    const result = [];
    const now = new Date('Jan 8 2022 08:10:00');
    const itr = generateIterator(['10','0/8','?','*','*'], now);
    
    for(let i = 0; i < 6; i++){
      result.push(itr.next().value);
    }
    expect(result).toEqual([
      new Date('Jan  8 2022 16:10:00'),
      new Date('Jan  9 2022 00:10:00'),
      new Date('Jan  9 2022 08:10:00'),
      new Date('Jan  9 2022 16:10:00'),
      new Date('Jan 10 2022 00:10:00'),
      new Date('Jan 10 2022 08:10:00'),
    ]);
  });
  
  it('Week', () => {
    const result = [];
    const now = new Date('Jan 2 2022 00:00:00');
    const itr = generateIterator(['10','20','?','*','1,2'], now);
    for(let i = 0; i < 6; i++){
      result.push(itr.next().value);
    }
    expect(result).toEqual([
      new Date('Jan  2 2022 20:10:00'),
      new Date('Jan  3 2022 20:10:00'),
      new Date('Jan  9 2022 20:10:00'),
      new Date('Jan 10 2022 20:10:00'),
      new Date('Jan 16 2022 20:10:00'),
      new Date('Jan 17 2022 20:10:00'),
    ]);
  });
  
  /*
  it('minute', () => {
    const result = [];
    const now = new Date('Jan 8 2022 00:00:00');
    const itr = generateIterator(['5','*','?','*','*'], now);
    for(let i = 0; i < 6; i++){
      result.push(itr.next().value);
    }
    expect(result).toEqual([
      new Date('Jan 8 2022 00:00:00'),
      new Date('Jan 8 2022 00:00:00'),
      new Date('Jan 8 2022 00:00:00'),
      new Date('Jan 8 2022 00:00:00'),
      new Date('Jan 8 2022 00:00:00'),
      new Date('Jan 8 2022 00:00:00'),
    ]);
  });
  */
})