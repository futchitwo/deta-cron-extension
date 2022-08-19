export type CronType = 'fixed' | 'normal' | 'uniform';

export type CronFunction = (event: {
  extention: CronEvent,
  _raw: unknown,
  body: string,
  type: string,
  cron: boolean,
  time: string,
}) => unknown;

export type CronEvent = {
  name: string,
  reference: Date,
  randomizedUTC: Date,
  //createdDate,
  //timezone,
};

export type CronConfig = {
  settingsDBName?: string,
  queueDBName?: string,
  timezone?: number,
  schedule: CronSchedule[],
  defaultFunction?: CronFunction,
};

export type CronSchedule = {
  name: string,
  type: 'fixed' | 'normal' | 'uniform',
  cron: string,
  halfRange?: number,
  function?: CronFunction,
};

declare function cron (setting: CronConfig): CronFunction;
