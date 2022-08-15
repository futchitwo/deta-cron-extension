import { createCrons, createCron } from '../../lib/cron/index.js';

describe('Create cron', () => {
  const defaultCronSetting = {
    name: 'test',
    type: 'fixed',
    cron: '0 0 ? * * *',
  } as const;
  
  it('normal cron', () => {
    const result = createCron(defaultCronSetting, {
      createdDate: new Date('Jan 2 2022 00:00:00'),
    });
    
    const answer = {
      name: 'test',
      reference: new Date(`Jan 3 2022 00:00:00`),
      randomizedUTC: new Date(`Jan 3 2022 00:00:00`),
    };
    
    expect(result).toEqual(answer);
  });

  it('onetime cron', () => {
    const result = createCron({
      name: 'test',
      type: 'fixed',
      cron: '0 0 1 1 ? 2022',
    }, {
      createdDate: new Date('Jan 2 2022 00:00:00'),
    });
    
    expect(result).toEqual(undefined);
  });

  it('timezone', () => {
    const result = createCron(defaultCronSetting, {
      createdDate: new Date('Jan 2 2022 00:00:00'),
      timezone: 9,
    });
    
    const answer = {
      name: 'test',
      reference: new Date('Jan 3 2022 00:00:00'),
      randomizedUTC: new Date('Jan 2 2022 15:00:00'),
    };
    
    expect(result).toEqual(answer);
  });
});
