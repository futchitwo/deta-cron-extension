import awsCron from 'aws-cron-parser';
import { randomizeDate } from './randomize.js';
import { CronSchedule, CronEvent } from '../../lib';

type CreateOption = {
  limitNum?: number,
  limitTime?: Date,
  createdDate: Date,
  timezone?: number,
  moveNext?: number,
};

// randomize sitakekka kakoni natta tokino syori 
// limitTime dou tukuru

export function createCrons(schedule: CronSchedule[], createOption: CreateOption): CronEvent[] {
  const cronArray: CronEvent[] = [];
  schedule.forEach(cron => {
    cronArray.push(...createCron(cron, createOption));
  });
  cronArray.sort((a, b) => a.randomizedUTC - b.randomizedUTC);

  if(createOption.limitNum){
    const limitedCronArray = cronArray.slice(0, createOption.limitNum);

    //Exceed limit if same time
    const lastCron = limitedCronArray[limitedCronArray.length - 1];
    
    for(
      let i = createOption.limitNum;
      (i < cronArray.length) && (cronArray[i].randomizedUTC <= lastCron.randomizedUTC);
      i++){
      limitedCronArray.push(cronArray[i]);
    }
    
    return limitedCronArray;
  } else {
    return cronArray;
  } 
}

export function createCron(
  schedule: CronSchedule, 
  {
    limitTime,
    limitNum,
    createdDate,
    timezone,
    //moveNext,
  }: CreateOption
) : CronEvent[]{
  const cron = awsCron.parse(schedule.cron);
  let next = awsCron.next(cron, createdDate);

  //if (moveNext) for (let i = 0; i < moveNext && next; i++) next = awsCron.next(cron, next);
  
  const events = [];
  if(limitTime) {
    while(next) {
      if (next < limitTime){
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
        
        events.push({
          name: schedule.name,
          reference: next,
          randomizedUTC,
          //createdDate,
        });
        next = awsCron.next(cron, next);
      } else {
        break;
      }
    }
  } else if(limitNum) {
    for (let i = 0; (i < limitNum) && next; i++) {
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
      
      events.push({
        name: schedule.name,
        reference: next,
        randomizedUTC,
        //createdDate,
      });
      next = awsCron.next(cron, next);
    }
  } else {
    throw Error('limitTime and limitNum do not exist.');
  }
  
  return events;
}

function toUTC(date: Date, timezone = 0):Date {
  return new Date(date.getTime() - timezone * 60 * 60 * 1000);
}

function toLocalTime(date: Date, timezone = 0):Date {
  return new Date(date.getTime() + timezone * 60 * 60 * 1000);
}
