import { getFullScheduleList } from '../lib/scheduleList.js';

describe('Cron', () => {
  it('Cron', async () => {
    const settings = {
      schedule: [
        {
          name: 'test2',
          type: 'fixed',
          cron: '0 0/3 ? * * *',
        } as const,
        {
          name: 'test4',
          type: 'fixed',
          cron: '0 0/4 ? * * *',
        } as const,
      ]
    };
    const mockDB = {
      settings: [
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
      ],
    };
    const answer = [
      {
        name: 'test2',
        type: 'fixed',
        cron: '0 0/2 ? * * *',
      } as const,
      {
        name: 'test4',
        type: 'fixed',
        cron: '0 0/4 ? * * *',
      } as const,
      {
        name: 'test5',
        type: 'fixed',
        cron: '0 0/5 ? * * *',
      } as const,
    ];
    
    const result = await getFullScheduleList(settings, mockDB);
    expect(result).toEqual(answer);
  });
});