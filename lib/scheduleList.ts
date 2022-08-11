import { getSettingsFromDB } from './deta/db.js';
import type { CronConfig, CronSchedule, CronEvent } from './../lib';

export async function getFullScheduleList(config: CronConfig, mockDB): Promise<CronSchedule[]> {
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

function findAndSplice<T>(arr: T[], checkFn:(item: T)=>boolean) :T[] {
  const i = arr.findIndex(checkFn);
  return ( i >= 0 ? arr.splice(i,1) : [] );
}
