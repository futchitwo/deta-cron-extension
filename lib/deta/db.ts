import { Deta } from 'deta';
import type { CronSchedule, CronEvent } from './../../lib';

type CronEventScheme = {
  [k in keyof CronEvent]: string
};

type MockDB = {
  queue: CronEvent[],
  settings: CronSchedule[],
} | null;

let deta: ReturnType<typeof Deta>;

try {
  deta = Deta();
} catch(err) {
  console.error(err);
}

export async function getQueueFromDB(DBName: string, mockDB: MockDB = null): Promise<CronEvent[]> {
  if(mockDB) return mockDB.queue;
  const db = deta.Base(DBName);
  const queue = (await db.get('queue'))?.value as CronEventScheme[] || [];
  return queue.map(q => ({
      ...q,
      randomizedUTC: new Date(q.randomizedUTC),
      reference: new Date(q.reference),
    }) as CronEvent
  );
}

export async function setQueueToDB(DBName: string, queue: CronEvent[], isMock = false): Promise<void> {
  if(isMock) return;
  const db = deta.Base(DBName);
  const queueJson = queue.map(q => ({
      ...q,
      randomizedUTC: q.randomizedUTC.toJSON(),
      reference: q.reference.toJSON(),
    }) as CronEventScheme
  );
  const res = await db.put(queueJson,'queue');
  console.log("saveQueue:", res)
}

export async function getSettingsFromDB(DBName: string, mockDB: MockDB = null): Promise<CronSchedule[]> {
  if(mockDB) return mockDB.settings;
  
  const db = deta.Base(DBName);
  const cronData = (await db.fetch()).items;
  
  // create database (for deta dashboard)
  //await db.put('', 'temp_key', { expireIn: 0 });
  console.log("dbcronsetting:",cronData)
  
  return cronData.map(cron => ({
    ...cron,
    name: cron.name || cron.key,
  })) as CronSchedule[];
}
