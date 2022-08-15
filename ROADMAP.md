# TODO  
- 年指定cron (next できない)
- cron api が 4XX 5XX エラーになったときの例外処理
  - TOKEN がない時、期限切れの時
- validate settings in DB
- DB: str to date improvement
- DB: `Deta()` at test env
- cron-queue -> cron-cache
- rename deta-random-cron
  - name
    - deta-cron-extention
    - deta-cron-tool
    - deta-cron-util
    - deta-multi-cron
    - deta-multiple-cron
  - change
    - github
    - package.json
    - deta
    - replit

- interval 廃止？

## Refactor
### Type Name
- CronFunction.event.randomcron -> 

### Function Name
- settingsDBName -> scheduleDBName
- cron-settings -> cron-schedule

## Test
- 年指定
- Timezone？