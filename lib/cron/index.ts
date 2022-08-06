import awsCron from 'aws-cron-parser';
import { randomizeDate } from './randomize.js';
import { CronData, CreateOption, EventData } from '../../lib';

// randomize sitakekka kakoni natta tokino syori 
// limitTime dou tukuru

export function createCrons(cronSettings: CronData[], createOption: CreateOption): EventData[]{
  const cronArray = [];
  cronSettings.forEach(cron => {
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

export function createCron(cronSetting: CronData, { limitTime, limitNum, createdDate, timezone }: CreateOption) : EventData[]{
  const cron = awsCron.parse(cronSetting.cron);
  let next = awsCron.next(cron, createdDate);
  
  const dates = [];
  if(limitTime) {
    while(next) {
      if (next < limitTime){
          const randomizedUTC = toUTC(
          randomizeDate(
            next,
            cronSetting.type,
            cronSetting.halfRange,
            //createdDate,
          ),
          timezone
        );
        randomizedUTC.setUTCSeconds(0,0);
        
        dates.push({
          name: cronSetting.name,
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
          cronSetting.type,
          cronSetting.halfRange,
          //createdDate,
        ),
        timezone
      );
      randomizedUTC.setUTCSeconds(0,0);
      
      dates.push({
        name: cronSetting.name,
        reference: next,
        randomizedUTC,
        //createdDate,
      });
      next = awsCron.next(cron, next);
    }
  } else {
    throw Error('limitTime and limitNum do not exist.');
  }
  
  return dates;
}

function toUTC(date: Date, timezone = 0):Date {
  return new Date(date.getTime() - timezone * 60 * 60 * 1000);
}

function toLocalTime(date: Date, timezone = 0):Date {
  return new Date(date.getTime() + timezone * 60 * 60 * 1000);
}
