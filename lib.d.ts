export type CronType = 'fixed' | 'normal' | 'uniform';

export type CronFunction = (event: {
  randomcron: EventData,
  _raw: unknown,
  body: string,
  type: string,
  cron: boolean,
  time: string,
}) => unknown;

export type EventData = {
  name: string,
  reference: Date,
  randomizedUTC: Date,
  //createdDate,
  //timezone,
};

export type CronSetting = {
  settingsDBName?: string,
  queueDBName?: string,
  timezone?: number,
  crons: CronData[],
  defaultFunction?: CronFunction,
};

export type CronData = {
  name: string,
  type: 'fixed' | 'normal' | 'uniform',
  cron: string,
  halfRange?: number,
  function?: CronFunction,
};

// delete
export type CreateOption = {
  limitNum?: number,
  limitTime?: Date,
  createdDate: Date,
  timezone?: number,
};

declare function cron (setting: CronSetting): CronFunction;
