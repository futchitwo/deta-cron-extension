# TODO
- interval 廃止？
- day month
  - Use https://github.com/beemhq/aws-cron-parser
- cron api が 4XX 5XX エラーになったときの例外処理
  - TOKEN がない時、期限切れの時
- validate settings in DB
- DB: str to date improvement
- DB: `Deta()` at test env
- cron-queue -> cron-cache

## Refactor
### Type Name
- CronSetting -> CronConfig
- CronData -> CronSchedule
- EventData -> CronEvent
- CronConfig.crons -> schedules
- CronFunction.event.randomcron -> 

### Function Name
- scheduler -> 

- settingsDBName -> scheduleDBName

### Architect
- createEventList 分解
  - getFullEventList
  - getNextEvent

- EventList をいい感じに
  