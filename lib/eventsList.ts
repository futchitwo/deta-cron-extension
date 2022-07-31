import { createCrons } from './cron/index.js';
import { getSettingsFromDB } from './deta/db.js';
import type { CronSetting, CronData, EventData } from './../lib';

export async function createEventList(settings: CronSetting, DBName: string, now: Date, mockDB): Promise<EventData[]> {
  
  const settingInDB = await getSettingsFromDB(DBName, mockDB);

  // TODO: validate settingsInDB
  
  // marge
  const cronSettings = settings.crons.map(cron => ({
    ...cron,
    ...findAndSplice(settingInDB, setting => setting.name === cron.name)
  }));

  // setting not in `settings`
  cronSettings.push(...settingInDB);
  
  return createCrons(cronSettings, {
    limitNum: 5,
    createdDate: now,
    timezone: settings.timezone,
  });
}

function findAndSplice<T>(arr: T[], checkFn:(item: T)=>boolean) :T {
  const i = arr.findIndex(checkFn);
  arr.splice(i,1);
  return arr[i];
}