export function* generateIterator(cronArray:string[], refDate:Date, includeNow = false){
  let itr: Generator<Date, never, Date>;
  refDate.setUTCSeconds(0,0);
  
  if(cronArray[2] === '?'){
    // week cron
    const DoWItr = generateDoWIterator(cronArray, refDate);
    itr = (function*(){
      while(true){
        yield* setBaseHours(cronArray, DoWItr.next().value).flat();
      }
    })() as Generator<Date, never, Date>;
  } else {
    throw new Error('wrong cron');
  }

  let next: Date;

  do {
    next = itr.next().value;
  } while (next < refDate || (!includeNow && next <= refDate));
  // Date(0) == Date (0) is always false
  
  while(true){
    yield next;
    next = itr.next().value;
  }
}

function setBaseMinutes(cronArray: string[], refDate: Date) {
  // 0 0-59 n/m * , 
  const minutesArray = parseCronPart(cronArray[0], { min:0, max:59 });

  // prevent overwrite
  const newrefDate = new Date(refDate);

  // return of setMinutes is num, so convert to Date
  return minutesArray.map(min => new Date(newrefDate.setMinutes(min, 0, 0)));
}

function setBaseHours(cronArray: string[], refDate: Date){
  // 0 0-23 n/m * ,
  const hoursArray = parseCronPart(cronArray[1], {min:0,max:23});

  // prevent overwrite
  const newrefDate = new Date(refDate);

  // return of setMinutes is num, so convert to Date
  return hoursArray.map(hour => setBaseMinutes(cronArray,new Date(newrefDate.setHours(hour))));
}

export function* generateDoWIterator(cronArray: string[], refDate: Date):Generator<Date, never, Date> {
  // 1 , 1-7 * L #2
  // # is TODO
  // ? is removed before
  // slash is invalid for strict
  
  const DoWArray = parseCronPart(cronArray[4], {
    min: 1,
    max: 7,
    preprocessor(cronDoW: string){
      return cronDoW
        .replace(/L/g, '7')
        .replace(/SUN/g, '1')
        .replace(/MON/g, '2')
        .replace(/TUE/g, '3')
        .replace(/WED/g, '4')
        .replace(/THU/g, '5')
        .replace(/FRI/g, '6')
        .replace(/SAT/g, '7')
    },
  });
  
  const baseDoW = refDate.getUTCDay() + 1; // AWS cron

  const iDoWArray = (function* () {
    for(let i = 0; ;i++){
      yield DoWArray[i % DoWArray.length] + 7 * Math.trunc(i / DoWArray.length) - baseDoW;
    }
  })();
  
  let daysToProceed: number;
  
  do {
    daysToProceed = iDoWArray.next().value;
  } while(daysToProceed < 0)
  
  while(true){
    yield new Date(refDate.getTime() + daysToProceed * 24 * 60 * 60 * 1000);
    daysToProceed = iDoWArray.next().value;
  }
}

function setBaseDayOfMonth(cronArray: string[], refDate:Date){
  // 1 1-31 n/m , * ? L W 
}

/* unused
function getNextDayOfWeek(targetDoW,baseDate){
  const MSEC_OF_DAY = 24 * 60 * 60 * 1000;
  const baseDoW = baseDate.getDay();
  
  // >= for support many timezone
  const daysToAdd = (baseDoW >= targetDoW) ?
    targetDoW - baseDoW + 7 : targetDoW - baseDoW;
  return new Date(baseDate.getTime() + daysToAdd * MSEC_OF_DAY);
}*/

type CronPartSetting = {
  min: number,
  max: number,
  preprocessor?: (str: string) => string
};

export function parseCronPart(rawCronPart: string, settings: CronPartSetting){
  const defaultPreprocessor = (str:string) => str;
  
  const { min, max, preprocessor = defaultPreprocessor } = settings;

  const parsedCron = [];
  const toNumber = validateNum(min, max);
  
  // parse with ','
  const splitedCronParts = preprocessor(rawCronPart).split(',') as string[];

  // generate parsedCron from each (without array nesting)
  splitedCronParts.forEach((cronPart: string) => {
    if (cronPart === '*') {
      for(let i = min; i <= max; i++) parsedCron.push(i);
      
    } else if (cronPart.includes('/')){
      const [prefix, interval] = cronPart.split('/');

      // 2-6/2 => 2,4,6
      if (prefix.includes('-')){
        const [start, end] = prefix.split('-');
        for(let i = 0; i <= max && i <= toNumber(end); i += toNumber(interval)){
          if(toNumber(start) <= i ) parsedCron.push(i);
        }
      } else {
        for(let i = 0; i + toNumber(prefix) <= max ; i += toNumber(interval)){
          parsedCron.push(i + toNumber(prefix));
        }
      }
      
    } else if (cronPart.includes('-')) {
      const [start, end] = cronPart.split('-');
      for(let i = toNumber(start); i <= toNumber(end); i++) parsedCron.push(i);
      
    } else {
      parsedCron.push(toNumber(cronPart));
    }
  });

  // deduplication and sort
  return [...new Set(parsedCron)].sort((n,m) => n-m);
}

function validateNum(min: number, max: number){
  return (str: string) => {
    const mayBeNum = Number(str)
    if (!Number.isInteger(mayBeNum)){
      throw Error(`"${mayBeNum}" is not Integer`);
    }

    if(mayBeNum < min || max < mayBeNum){
      throw Error(`"${mayBeNum}" is out of range between ${min} - ${max}`);
    }
    
    return mayBeNum;
  };
}

/*module.exports = {
  generateIterator,
  setBaseHours,
  parseCronPart,
  generateDoWIterator,
};*/