import * as fs from 'fs';
import { getQueueFromDB, setQueueToDB } from './deta/db.js';
import { setCron } from './deta/cli.js';
import { createEventList } from './eventsList.js';
import { isEmpty } from './util.js'; 

import type { CronSetting, EventData, CronFunction } from './../lib';

export function cron(setting: CronSetting, mockDB = null): CronFunction {
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

async function scheduler(setting: CronSetting, mockDB): Promise<EventData[]> {
  let eventsList = await getQueueFromDB(setting.queueDBName, mockDB);
  let triggeredEvents: EventData[] = [];
  
  if (isEmpty(eventsList)) {
    // first event
    // generate queue
    eventsList.push(...await createEventList(setting, setting.settingsDBName, new Date(), mockDB));
  } else {
    // generate triggered events list and generate queue
    [ eventsList, triggeredEvents ] = await makeSchedule(setting, eventsList, mockDB);
  }

  await Promise.all([
    setQueueToDB(setting.queueDBName, eventsList, Boolean(mockDB)),
    setCron(eventsList[0].randomizedUTC, Boolean(mockDB)),
  ]);
  
  return triggeredEvents;
}

async function makeSchedule(setting: CronSetting, eventsList: EventData[], mockDB): Promise<EventData[][]> {
  const now = new Date();
  const triggeredEvents: EventData[] = [];
  
  // while nextEventShouldDispatch
  while(eventsList[0]?.randomizedUTC <= now){
    // push first event to trigered list
    triggeredEvents.push(eventsList.shift());

    if(isEmpty(eventsList)){
      // set event
      eventsList.push(...await createEventList(setting, setting.settingsDBName, now, mockDB));
    }
  }

  return [ eventsList, triggeredEvents ];
}

function getPackageName(): string | undefined {
  const packageJson = fs.readFileSync(process.cwd() + '/package.json');
  return JSON.parse(packageJson.toString()).name;
}
