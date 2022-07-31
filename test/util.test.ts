import { dateToCron } from '../lib/util.js'

describe('Date to cron', () => {
  it('Date to cron', () => {
    const result = dateToCron(new Date('Jan 2 2022 03:04:00'));
    expect(result).toEqual('4 3 2 1 ? 2022');
  });
});