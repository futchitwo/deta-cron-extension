# TODO
- cron api が 4XX 5XX エラーになったときの例外処理
  - TOKEN がない時、期限切れの時
- validate settings in DB
- DB: str to date improvement
- // cron-queue -> cron-cache
- rename deta-random-cron
  - name
    - deta-cron-extention
    - deta-cron-ex
    - deta-cron-tool
    - deta-cron-util
    - deta-multi-cron
    - deta-multiple-cron
  - change
    - github
    - package.json
    - deta
    - replit

## Refactor
- lib.d.ts -> types.d.ts
    - package.json
- Add type to MockDB

### Function Name
- settingsDBName -> scheduleDBName
- cron-settings -> cron-schedule

## Test
- 年指定
- Timezone？