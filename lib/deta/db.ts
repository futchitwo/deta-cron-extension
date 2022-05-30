import { Deta } from 'deta';
import type { CronData, EventData } from './../../lib';

const deta = Deta();

// str to Date
// key

export async function getQueueFromDB(DBName: string, mockDB = null): Promise<EventData[]>{
  if(mockDB) return mockDB.queue;
  const db = deta.Base(DBName);
  return await db.get('queue') as unknown as EventData[];
}

export async function setQueueToDB(DBName: string, queue: EventData[], isMock = false){
  if(isMock) return;
  const db = deta.Base(DBName);
  db.put(queue,'queue');
}

export async function getSettingsFromDB(DBName: string, mockDB = null): Promise<CronData[]>{
  if(mockDB) return mockDB.settings;
  const db = deta.Base(DBName);
  const cronData = await db.fetch() as unknown as (CronData & {key: string} )[];
  return cronData.map(cron => {
    return {
      ...cron,
      name: cron.name || cron.key,
    };
  }) as CronData[];
}

/*module.exports = {
  getCronFromDB,
  setCronToDB,
  getSettingsFromDB,
}*/