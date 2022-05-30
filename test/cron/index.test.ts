import { createCrons, createCron } from '../../lib/cron/index.js';

describe('Create cron', () => {
  const defaultCronSetting = {
    name: 'test',
    type: 'fixed',
    cron: '0 0 ? * * *',
  };
  
  it('limitNum', () => {
    const result = createCron(defaultCronSetting, {
      limitNum: 5,
      createdDate: new Date('Jan 2 2022 00:00:00'),
    });
    
    const answer = Array.from({length: 5}, (_, i) => ({
      name: 'test',
      reference: new Date(`Jan ${ 3 + i } 2022 00:00:00`),
      randomizedUTC: new Date(`Jan ${ 3 + i } 2022 00:00:00`),
    }));
    
    expect(result).toEqual(answer);
  });

  it('limitTime', () => {
    const result = createCron(defaultCronSetting, {
      limitTime: new Date('Jan 10 2022 00:00:00'),
      createdDate: new Date('Jan 2 2022 00:00:00'),
    });
    
    const answer = Array.from({length: 7}, (_, i) => ({
      name: 'test',
      reference: new Date(`Jan ${ 3 + i } 2022 00:00:00`),
      randomizedUTC: new Date(`Jan ${ 3 + i } 2022 00:00:00`),
    }));
    
    expect(result).toEqual(answer);
  });

  it('timezone', () => {
    const result = createCron(defaultCronSetting, {
      limitNum: 1,
      createdDate: new Date('Jan 2 2022 00:00:00'),
      timezone: 9,
    });
    
    const answer = [{
      name: 'test',
      reference: new Date('Jan 3 2022 00:00:00'),
      randomizedUTC: new Date('Jan 2 2022 15:00:00'),
    }];
    
    expect(result).toEqual(answer);
  });
});

describe('create crons', () => {
  const defaultCronSettings = [
    {
      name: 'test2',
      type: 'fixed',
      cron: '0 0/2 ? * * *',
    },
    {
      name: 'test5',
      type: 'fixed',
      cron: '0 0/5 ? * * *',
    },
  ];
  
  it('limitNum' , () => {
    const result = createCrons(defaultCronSettings, {
      limitNum: 8,
      startDate: new Date('Jan 2 2022 00:00:00'),
    });

    const answer = [
      {
        name: 'test2',
        reference: new Date('Jan 2 2022 02:00:00'),
        randomizedUTC: new Date('Jan 2 2022 02:00:00'),
      },
      {
        name: 'test2',
        reference: new Date('Jan 2 2022 04:00:00'),
        randomizedUTC: new Date('Jan 2 2022 04:00:00'),
      },
      {
        name: 'test5',
        reference: new Date('Jan 2 2022 05:00:00'),
        randomizedUTC: new Date('Jan 2 2022 05:00:00'),
      },
      {
        name: 'test2',
        reference: new Date('Jan 2 2022 06:00:00'),
        randomizedUTC: new Date('Jan 2 2022 06:00:00'),
      },
      {
        name: 'test2',
        reference: new Date('Jan 2 2022 08:00:00'),
        randomizedUTC: new Date('Jan 2 2022 08:00:00'),
      },
      {
        name: 'test2',
        reference: new Date('Jan 2 2022 10:00:00'),
        randomizedUTC: new Date('Jan 2 2022 10:00:00'),
      },
      {
        name: 'test5',
        reference: new Date('Jan 2 2022 10:00:00'),
        randomizedUTC: new Date('Jan 2 2022 10:00:00'),
      },
      {
        name: 'test2',
        reference: new Date('Jan 2 2022 12:00:00'),
        randomizedUTC: new Date('Jan 2 2022 12:00:00'),
      },
    ]
    
    expect(result).toEqual(answer);
  });

  it('Exceed limit if same time' , () => {
    const result = createCrons(defaultCronSettings, {
      limitNum: 6,
      startDate: new Date('Jan 2 2022 00:00:00'),
    });

    const answer = [
      {
        name: 'test2',
        reference: new Date('Jan 2 2022 02:00:00'),
        randomizedUTC: new Date('Jan 2 2022 02:00:00'),
      },
      {
        name: 'test2',
        reference: new Date('Jan 2 2022 04:00:00'),
        randomizedUTC: new Date('Jan 2 2022 04:00:00'),
      },
      {
        name: 'test5',
        reference: new Date('Jan 2 2022 05:00:00'),
        randomizedUTC: new Date('Jan 2 2022 05:00:00'),
      },
      {
        name: 'test2',
        reference: new Date('Jan 2 2022 06:00:00'),
        randomizedUTC: new Date('Jan 2 2022 06:00:00'),
      },
      {
        name: 'test2',
        reference: new Date('Jan 2 2022 08:00:00'),
        randomizedUTC: new Date('Jan 2 2022 08:00:00'),
      },
      {
        name: 'test2',
        reference: new Date('Jan 2 2022 10:00:00'),
        randomizedUTC: new Date('Jan 2 2022 10:00:00'),
      },
      {
        name: 'test5',
        reference: new Date('Jan 2 2022 10:00:00'),
        randomizedUTC: new Date('Jan 2 2022 10:00:00'),
      },
    ]
    
    expect(result).toEqual(answer);
  });

  // todo: limittime
});