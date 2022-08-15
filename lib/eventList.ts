import { CronEvent, CronSchedule } from "lib.js";
import { createCron } from "./cron/index.js";

/*
export async function createEventList() {
  getDB().map(cron => {
    if (!cron._next.length) cron._next = createCron();
    return cron
  })
}
*/

export function getEventList(schedule: CronSchedule[], queue: CronEvent[], timezone?: number, now = new Date()) {
  const scheduleNotQueued = schedule.filter(scdl => !queue.some(q => scdl.name === q.name));
  
  const eventNotQueued = scheduleNotQueued.map(
    scdl => createCron(
      scdl,
      {
        limitNum: 1,
        createdDate: now,
        timezone,
      }
    )[0]
  );

  return queue.concat(
    // validate for one time cron
    ...eventNotQueued.filter(ev => ev !== undefined)
  ).sort((a, b) => a.randomizedUTC.getTime() - b.randomizedUTC.getTime());
}

export function getNextEvent(schedule: CronSchedule[], event: CronEvent[], timezone?: number) {
  const nextEvent: CronEvent[] = [];
  event.forEach(
    ev => {
      const scdl = schedule.find(scdl => scdl.name === ev.name);
      const next = scdl ? createCron(
        scdl,
        {
          limitNum: 1,
          createdDate: ev.reference,
          timezone,
        }
      ) : [];
      if (next.length) nextEvent.push(next[0]);
    }
  );

  // validate for one time cron
  return nextEvent.filter(ev => ev !== undefined);
}

export function getNewQueue(schedule: CronSchedule[], triggeredEvent: CronEvent[], notTriggeredEvent: CronEvent[], timezone?: number) {
  const nextEvent = getNextEvent(schedule, triggeredEvent, timezone);

  const newQueue = notTriggeredEvent.concat(nextEvent);
  newQueue.sort((a, b) => a.randomizedUTC.getTime() - b.randomizedUTC.getTime());
  return newQueue;
}

export function getTriggeredEvent(event: CronEvent[], now = new Date()) {
  //event.sort((a, b) => a.randomizedUTC.getTime() - b.randomizedUTC.getTime());
  const indexNotTriggered = event.findIndex(ev => now < ev.randomizedUTC);
  const triggeredNum = indexNotTriggered !== -1 ? indexNotTriggered : event.length;
  const triggered = event.splice(0, triggeredNum);
  
  return [
    triggered,
    event,
  ];
}
