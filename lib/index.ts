import { getQueueFromDB, setQueueToDB } from './deta/db.js';
import { setCron } from './deta/cli.js';
import { createEventList } from './eventsList.js';
import * as fs from 'fs';

import type { CronSetting, EventData } from './../lib';


// createdData yorimo mae 
export async function cron(setting: CronSetting, mockDB = null) {
  const isMock = !!mockDB;
  const { microName, microId } = getMicroInfo();
  
  const queueDBName = setting.queueDBName || microName + '-cronQueue';
  const settingsDBName = setting.settingsDBName || microName + 'cronSettings';
  
  const eventsList = await getQueueFromDB(queueDBName, mockDB);
  const trigeredEvents: EventData[] = [];
  const now = new Date();
  
  if(!eventsList){
    // first event
    eventsList.push(...await createEventList(setting, settingsDBName, now, mockDB));

    setQueueToDB(queueDBName, eventsList, isMock);
    setCron(microId, eventsList[0].randomizedUTC, isMock);

    return (event) => {
      console.info('Cron Setting is Finished!');
    }
  }

  function nextEventShouldFire(next){
    return next && next.randomizedUTC <= now
      //next.randomizedUTC <= trigeredEvents[0].randomizedUTC
      //next.randomizedUTC <= trigeredEvents[0].createdData
     //now?
     // true false
  }
  
  while(nextEventShouldFire(eventsList[0])){
    // kokono jyunban
    trigeredEvents.push(eventsList.shift());
    if(!eventsList){
      // set event
      eventsList.push(...await createEventList(setting, settingsDBName, now, mockDB));
    }
  }

  setQueueToDB(queueDBName, eventsList, isMock);
  setCron(microId, eventsList[0].randomizedUTC, isMock);

  
  return (event) => {
    // heiretuka
    trigeredEvents.forEach((cronData: EventData) => {
      event.randomcron = cronData;
      const fn = setting.crons.find(cron => cron.name === cronData.name).function || setting.defaultFunction;
      if(fn){
        fn(event);
      } else {
        console.error(`Function(${cronData.name}) and defaultFuction are not exist.`);
      }
    });
  };
}


function getMicroInfo() {
  const prog_info = fs.readFileSync('./.deta/prog_info');
  const info = JSON.parse(prog_info.toString()) as {[k:string]: string};
  return {
    microName: info.name,
    microId: info.id,
  }
}
