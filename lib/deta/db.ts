import { Deta } from 'deta';
import type { CronData, EventData } from './../../lib';


type EventDataScheme = {
  [k in keyof EventData]: string
};

const deta = Deta();

export async function getQueueFromDB(DBName: string, mockDB = null): Promise<EventData[]> {
  if(mockDB) return mockDB.queue;
  const db = deta.Base(DBName);
  const queue = (await db.get('queue'))?.value as EventDataScheme[] || [];
  return queue.map(q => ({
      ...q,
      randomizedUTC: new Date(q.randomizedUTC),
      reference: new Date(q.reference),
    }) as EventData
  );
}

export async function setQueueToDB(DBName: string, queue: EventData[], isMock = false) {
  if(isMock) return;
  const db = deta.Base(DBName);
  const queueJson = queue.map(q => ({
      ...q,
      randomizedUTC: q.randomizedUTC.toJSON(),
      reference: q.reference.toJSON(),
    }) as EventDataScheme
  );
  const res = await db.put(queueJson,'queue');
  console.log("saveQueue:", res)
}

export async function getSettingsFromDB(DBName: string, mockDB = null): Promise<CronData[]> {
  if(mockDB) return mockDB.settings;
  const db = deta.Base(DBName);
  const cronData = (await db.fetch()).items;
  return cronData.map(cron => ({
    ...(cron?.value as object || {}),
    name: cron.name || cron.key,
  })) as CronData[];
}
