import awsCron from 'aws-cron-parser';
import { randomizeDate } from './randomize.js';
import { CronSchedule, CronEvent } from '../../lib';

export function createCron(
  schedule: CronSchedule, 
  {
    timezone,
    createdDate,
  } : {
    timezone?: number,
    createdDate: Date
  }
) : CronEvent | undefined {
  const cron = awsCron.parse(schedule.cron);
  let next = awsCron.next(cron, createdDate);

  if(!next) return undefined;
  
  const randomizedUTC = toUTC(
    randomizeDate(
      next,
      schedule.type,
      schedule.halfRange,
      //createdDate,
    ),
    timezone
  );
  randomizedUTC.setUTCSeconds(0,0);
  
  return {
    name: schedule.name,
    reference: next,
    randomizedUTC,
    //createdDate,
  };
}

function toUTC(date: Date, timezone = 0):Date {
  return new Date(date.getTime() - timezone * 60 * 60 * 1000);
}

function toLocalTime(date: Date, timezone = 0):Date {
  return new Date(date.getTime() + timezone * 60 * 60 * 1000);
}
