import { createEventList } from '../lib/eventsList.js';

describe('Cron', () => {
  it('Cron', () => {
    const settings = {
      crons: [
        {
          name: 'test2',
          type: 'fixed',
          cron: '0 0/3 ? * * *',
        } as const,
      ]
    };
    const mockDB = [
      {
        name: 'test2',
        type: 'fixed',
        cron: '0 0/2 ? * * *',
      } as const,
      {
        name: 'test5',
        type: 'fixed',
        cron: '0 0/5 ? * * *',
      } as const,
    ];
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
    ];
    
    const result = createEventList(settings, 'test', new Date('Jan 2 2022 00:00:00'), mockDB);
    expect(result).toEqual(answer);
  });
});