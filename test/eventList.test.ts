import { getEventList, getNextEvent, getNewQueue,  getTriggeredEvent } from '../lib/eventList.js';

describe('getEventList', () => {
  it('getEventList', () => {
    const schedule = [{
      name: 'test1',
      type: 'fixed',
      cron: '0 0 ? * * *',
    }, {
      name: 'test2',
      type: 'fixed',
      cron: '0 1 ? * * *',
    }];
    const queue = [{
      name: 'test1',
      reference: new Date('Jan 2 2022 00:00:00'),
      randomizedUTC: new Date('Jan 2 2022 00:00:00'),
    }];
    
    const answer = [{
      name: 'test2',
      reference: new Date('Jan 1 2022 01:00:00'),
      randomizedUTC: new Date('Jan 1 2022 01:00:00'),
    }, {
      name: 'test1',
      reference: new Date('Jan 2 2022 00:00:00'),
      randomizedUTC: new Date('Jan 2 2022 00:00:00'),
    }];
    const result = getEventList(schedule, queue, 0, new Date('Jan 1 2022 00:00:00'));
    expect(result).toEqual(answer);
  });

  it('one time cron', () => {
    const schedule = [{
      name: 'test',
      type: 'fixed',
      cron: '0 0 1 1 ? 2022',
    }];
    const result = getEventList(schedule, [], 0 ,new Date('Jan 2 2022 00:00:00'));
    expect(result).toEqual([]);
  });
});

describe('getNextEvent', () => {
  it('getNextEvent', () => {
    const schedule = [{
      name: 'test1',
      type: 'fixed',
      cron: '0 0 ? * * *',
    }, {
      name: 'test2',
      type: 'fixed',
      cron: '0 1 ? * * *',
    }];
    const event = [{
      name: 'test1',
      reference: new Date('Jan 2 2022 00:00:00'),
      randomizedUTC: new Date('Jan 2 2022 00:00:00'),
    }, {
      name: 'test3',
      reference: new Date('Jan 2 2022 00:00:00'),
      randomizedUTC: new Date('Jan 2 2022 00:00:00'),
    }];
    
    const answer = [{
      name: 'test1',
      reference: new Date('Jan 3 2022 00:00:00'),
      randomizedUTC: new Date('Jan 3 2022 00:00:00'),
    }];
    const result = getNextEvent(schedule, event);
    expect(result).toEqual(answer);
  });

  it('one time cron', () => {
    const schedule = [{
      name: 'test',
      type: 'fixed',
      cron: '0 0 1 1 ? 2022',
    }];

    const event = [{
      name: 'test',
      reference: new Date('Jan 1 2022 00:00:00'),
      randomizedUTC: new Date('Jan 1 2022 00:00:00'),
    }];
    
    const result = getNextEvent(schedule, event);
    expect(result).toEqual([]);
  });

  it('has timezone', () => {
    const schedule = [{
      name: 'test1',
      type: 'fixed',
      cron: '0 * ? * * *',
    }];
    const event = [{
      name: 'test1',
      reference: new Date('Jan 1 2022 00:00:00'),
      randomizedUTC: new Date('Jan 1 2022 00:00:00'),
    }];
    
    const answer = [{
      name: 'test1',
      reference: new Date('Jan 1 2022 01:00:00'),
      randomizedUTC: new Date('Jan 1 2022 01:00:00'),
    }];
    const result = getNextEvent(schedule, event, 9);
    expect(result).toEqual(answer);
  });
});

describe('getNewQueue', () => {
  it('getNewQueue', () => {
    const schedule = [{
      name: 'test1',
      type: 'fixed',
      cron: '0 0 ? * * *',
    }, {
      name: 'test2',
      type: 'fixed',
      cron: '0 1 ? * * *',
    }];
    const triggeredEvent = [{
      name: 'test1',
      reference: new Date('Jan 2 2022 00:00:00'),
      randomizedUTC: new Date('Jan 2 2022 00:00:00'),
    }, {
      name: 'test3',
      reference: new Date('Jan 2 2022 02:00:00'),
      randomizedUTC: new Date('Jan 2 2022 02:00:00'),
    }];
    const notTriggeredEvent = [{
      name: 'test2',
      reference: new Date('Jan 2 2022 01:00:00'),
      randomizedUTC: new Date('Jan 2 2022 01:00:00'),
    }];
    
    const answer = [{
      name: 'test2',
      reference: new Date('Jan 2 2022 01:00:00'),
      randomizedUTC: new Date('Jan 2 2022 01:00:00'),
    }, {
      name: 'test1',
      reference: new Date('Jan 3 2022 00:00:00'),
      randomizedUTC: new Date('Jan 3 2022 00:00:00'),
    }];
    const result = getNewQueue(schedule, triggeredEvent, notTriggeredEvent);
    expect(result).toEqual(answer);
  });
});

describe('getTriggeredEvent', () => {
  it('getTriggeredEvent', () => {
    const event = [{
      name: 'test2',
      reference: new Date('Jan 1 2022 01:00:00'),
      randomizedUTC: new Date('Jan 1 2022 01:00:00'),
    }, {
      name: 'test3',
      reference: new Date('Jan 1 2022 12:00:00'),
      randomizedUTC: new Date('Jan 1 2022 12:00:00'),
    }, {
      name: 'test1',
      reference: new Date('Jan 2 2022 00:00:00'),
      randomizedUTC: new Date('Jan 2 2022 00:00:00'),
    },];
      
    const answer = [
      [{
        name: 'test2',
        reference: new Date('Jan 1 2022 01:00:00'),
        randomizedUTC: new Date('Jan 1 2022 01:00:00'),
      }, {
        name: 'test3',
        reference: new Date('Jan 1 2022 12:00:00'),
        randomizedUTC: new Date('Jan 1 2022 12:00:00'),
      }],
      [{
        name: 'test1',
        reference: new Date('Jan 2 2022 00:00:00'),
        randomizedUTC: new Date('Jan 2 2022 00:00:00'),
      }]
    ];
    const result = getTriggeredEvent(event, new Date('Jan 1 2022 12:00:00'));
    expect(result).toEqual(answer);
  });

  it('TriggeredAll', () => {
    const event = [{
      name: 'test1',
      reference: new Date('Jan 1 2022 00:00:00'),
      randomizedUTC: new Date('Jan 1 2022 00:00:00'),
    }, {
      name: 'test2',
      reference: new Date('Jan 1 2022 01:00:00'),
      randomizedUTC: new Date('Jan 1 2022 01:00:00'),
    }, {
      name: 'test3',
      reference: new Date('Jan 1 2022 12:00:00'),
      randomizedUTC: new Date('Jan 1 2022 12:00:00'),
    }];
      
    const answer = [
      [{
        name: 'test1',
        reference: new Date('Jan 1 2022 00:00:00'),
        randomizedUTC: new Date('Jan 1 2022 00:00:00'),
      }, {
        name: 'test2',
        reference: new Date('Jan 1 2022 01:00:00'),
        randomizedUTC: new Date('Jan 1 2022 01:00:00'),
      }, {
        name: 'test3',
        reference: new Date('Jan 1 2022 12:00:00'),
        randomizedUTC: new Date('Jan 1 2022 12:00:00'),
      }],
      []
    ];
    const result = getTriggeredEvent(event, new Date('Jan 1 2022 12:00:00'));
    expect(result).toEqual(answer);
  });

  it('NoTriggered', () => {
    const event = [{
      name: 'test1',
      reference: new Date('Jan 1 2022 00:01:00'),
      randomizedUTC: new Date('Jan 1 2022 00:01:00'),
    }, {
      name: 'test2',
      reference: new Date('Jan 1 2022 01:00:00'),
      randomizedUTC: new Date('Jan 1 2022 01:00:00'),
    }, {
      name: 'test3',
      reference: new Date('Jan 1 2022 12:00:00'),
      randomizedUTC: new Date('Jan 1 2022 12:00:00'),
    }];
      
    const answer = [
      [],
      [{
        name: 'test1',
        reference: new Date('Jan 1 2022 00:01:00'),
        randomizedUTC: new Date('Jan 1 2022 00:01:00'),
      }, {
        name: 'test2',
        reference: new Date('Jan 1 2022 01:00:00'),
        randomizedUTC: new Date('Jan 1 2022 01:00:00'),
      }, {
        name: 'test3',
        reference: new Date('Jan 1 2022 12:00:00'),
        randomizedUTC: new Date('Jan 1 2022 12:00:00'),
      }]
    ];
    const result = getTriggeredEvent(event, new Date('Jan 1 2022 00:00:00'));
    expect(result).toEqual(answer);
  });
});