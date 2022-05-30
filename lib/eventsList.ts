import { createCrons } from './cron/index.js';
import { getSettingsFromDB } from './deta/db.js';
import type { CronSetting, CronData, EventData } from './../lib';

export async function createEventList(setting: CronSetting, DBName: string, now: Date, mockDB): Promise<EventData[]> {
  
  const settingInDB = await getSettingsFromDB(DBName, mockDB);
  const cronSettings = setting.crons.map(cron => {
    const settingInDBIndex = settingInDB.findIndex(setting => setting.name === cron.name);
    return { ...cron, ...settingInDB[settingInDBIndex] };
  });

  return createCrons(cronSettings, {
    limitNum: 5,
    createdDate: now,
    timezone: setting.timezone,
  });
}
