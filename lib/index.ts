import * as fs from 'fs';
import { getQueueFromDB, setQueueToDB } from './deta/db.js';
import { setCron } from './deta/cli.js';
import { getFullScheduleList } from './scheduleList.js';
import { createCrons } from './cron/index.js';
import { isEmpty } from './util.js'; 

import type { CronConfig, CronEvent, CronFunction } from './../lib';

export function cron(setting: CronConfig, mockDB = null): CronFunction {
  const microName = getPackageName() || process.env.AWS_LAMBDA_FUNCTION_NAM;

  setting.queueDBName = setting.queueDBName || microName + '-cron-queue';
  setting.settingsDBName = setting.settingsDBName || microName + '-cron-settings';

  return (async (event) => {
    const triggeredEvents = await scheduler(setting, mockDB);
    console.log("triggered:", triggeredEvents);
    
    if (isEmpty(triggeredEvents)) {
      const initMessage = 'Finish cron initialization!';
      console.info(initMessage);
      return initMessage;
    } else {
      return await Promise.all(triggeredEvents.map((cronData) => {
        event.randomcron = cronData;
        const fn = setting.crons.find(cron => cron.name === cronData.name)?.function || setting.defaultFunction || null;
        if (fn) {
          return fn(event); // Promise
        } else {
          const noFuncMessage = `Function(${cronData.name}) and defaultFuction are not exist.`;
          console.error(noFuncMessage);
          return noFuncMessage;
        }
      }));
    }
  }) as CronFunction;
}

async function scheduler(config: CronConfig, mockDB): Promise<CronEvent[]> {
  let eventsList = await getQueueFromDB(config.queueDBName, mockDB);
  let triggeredEvents: CronEvent[] = [];
  
  if (isEmpty(eventsList)) {
    // first event
    // generate queue
    const fullScheduleList = await getFullScheduleList(config, mockDB);
    eventsList.push(...createCrons(
        fullScheduleList, 
        {
          limitNum: 5,
          createdDate: new Date(),
          timezone: config.timezone,
        }
      ));
  } else {
    // generate triggered events list and generate queue
    [ eventsList, triggeredEvents ] = await makeSchedule(config, eventsList, mockDB);
  }

  await Promise.all([
    setQueueToDB(config.queueDBName, eventsList, Boolean(mockDB)),
    setCron(eventsList[0].randomizedUTC, Boolean(mockDB)),
  ]);
  
  return triggeredEvents;
}

async function makeSchedule(config: CronConfig, eventsList: CronEvent[], mockDB): Promise<CronEvent[][]> {
  const fullScheduleList = await getFullScheduleList(config, mockDB);
  const now = new Date();
  const triggeredEvents: CronEvent[] = [];
  
  // while nextEventShouldDispatch
  while(eventsList[0]?.randomizedUTC <= now){
    // push first event to trigered list
    triggeredEvents.push(eventsList.shift());

    if(isEmpty(eventsList)){
      // set event
      eventsList.push(...createCrons(
        fullScheduleList, 
        {
          limitNum: 5,
          createdDate: now,
          timezone: config.timezone,
        }
      ));
    }
  }

  return [ eventsList, triggeredEvents ];
}

function getPackageName(): string | undefined {
  const packageJson = fs.readFileSync(process.cwd() + '/package.json');
  return JSON.parse(packageJson.toString()).name;
}
