const { generateIterator } = require('./baseTime.js');
const { randomizeDate } = require('./randomize.js');
//const { dateToCron } = require('./../util.js');

//startdate wo now nisita toki ha second millsec wo 0 nisuru?
// limitTime dou tukuru

function createCrons(cronSettings, createOption){
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
      cronArray[i].randomizedUTC <= lastCron.randomizedUTC;
      i++){
      limitedCronArray.push(cronArray[i]);
    }
    
    return limitedCronArray;
  } else {
    return cronArray;
  } 
}

function createCron(cronSetting, { limitTime, limitNum, startDate }){
  const cronParts = cronSetting.cron.split(' ');
  const itr = generateIterator(cronParts, startDate);
  let next = itr.next().value;
  
  const dates = [];
  if(limitTime) {
    while(true){
      if (next < limitTime){
        dates.push({
          name: cronSetting.name,
          reference: next,
          randomizedUTC: toUTC(
            randomizeDate(
              next,
              cronSetting.type,
              cronSetting.halfRange,
            ),
            cronSetting.timezone
          ),
        });
        next = itr.next().value;
      } else {
        break;
      }
    }
  } else if(limitNum) {
    for (let i = 0; i < limitNum; i++){
      dates.push({
        name: cronSetting.name,
        reference: next,
        randomizedUTC: toUTC(
          randomizeDate(
            next,
            cronSetting.type,
            cronSetting.halfRange,
          ),
          cronSetting.timezone
        ),
      });
      next = itr.next().value;
    }
  } else {
    throw Error('limitTime and limitNum is not ');
  }
  
  return dates;
}

function toUTC(date, timezone = 0) {
  return new Date(date.getTime() - timezone * 60 * 60 * 1000);
}

module.exports = {
  createCron,
  createCrons,
}