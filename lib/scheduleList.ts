import { getSettingsFromDB } from './deta/db.js';
import type { CronConfig, CronSchedule } from './../lib';

export async function getFullScheduleList(config: CronConfig, mockDB): Promise<CronSchedule[]> {
  if (config.settingsDBName == null) throw Error('scheduleList: config.settingsDBName must not empty');
  
  const settingInDB = await getSettingsFromDB(config.settingsDBName, mockDB);
  
  // TODO: validate settingsInDB

  // overwrite schedule
  const schedule: CronSchedule[] = config.schedule.map(cron => ({
    ...cron,
    ...findAndSplice(settingInDB, setting => setting.name === cron.name)
  }));

  // marge schedule not in config
  schedule.push(...settingInDB);

  console.log('cronschedule:', schedule);
  
  return schedule;
}

function findAndSplice<T>(arr: T[], checkFn:(item: T)=>boolean): T | undefined {
  const i = arr.findIndex(checkFn);
  return ( i >= 0 ? arr.splice(i,1)[0] : undefined );
}
