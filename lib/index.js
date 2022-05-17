const { getCronFromDB, setCronToDB } = require('../deta/db.js');
const { setCron } = require('../deta/cli.js');

const queueDBName;
const settingDBName;

function cron(fn, mockDB = null) {
  const isMock = !!mockDB;
  const eventsList = getCronFromDB(queueDBName, mockDB);
  let nextEvent;
  
  if(!eventsList){
    // first event
    nextEvent;
  }
  
  let trigeredEvents = [eventsList.shift()];
  nextEvent = eventsList.shift();
  while(nextEvent && nextEvent.randomizedUTC <= trigeredEvents[0].randomizedUTC){
    trigeredEvents.push(nextEvent);
    nextEvent = eventsList.shift();
  }
  
  if(nextEvent) {
    eventsList.unshift(nextEvent);
  } else if(!eventsList){
    // set event
    nextEvent = eventsList[0];
  }

  setCronToDB(eventsList, isMock);
  setCron(nextEvent, isMock);

  
  return (event) => {
    // heiretuka
    trigeredEvents.forEach(cronData => {
      event.randomcron = cronData;
      fn(event);
    });
  };
}