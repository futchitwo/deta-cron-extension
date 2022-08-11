# Deta Random Cron
Randomize the timing of cron execution.

## How To Use
1. Set an access token as environment variable on your Micro.
2. Install and setting this package to your Micro.
3. Deploy to Deta.
4. Remember to set cron manually the first time for initialization! (cli: `deta set cron "1 minute"`)

## Config

After updating the settings, the queues stored in the database must be deleted from the deta.sh dashboard.

設定を更新した後は、deta.sh dashboard より database に保存された queueを削除する必要があります。

### environment variable
- `DETA_ACCESS_TOKEN`
  - Note that it expires in 1 year.

### index.js
```js
const { app } = require('deta');
const { cron } = require('./lib');

app.lib.cron(
  cron({
    settingsDBName: '', // option
    queueDBName: '', // option
    timezone: 0, // option, hour
    schedule: [
      {
        name: 'exampleEvent',
        type: '', // 'fixed' | 'normal' | 'uniform'
        cron: '15 * ? * * *',
        halfRange: 5, // minute
        //this example is range of 10-20 minutes
        function: (event) => { // If omitted, executes the default function
          console.log('yey');
        },
      },
    ],
    defaultFunction: (event) => { // option
      console.log('default event!');
    },
  }
));

module.exports = app;
```

## About parameter

### crons.halfRange
halfRange is the range of time to be randomized.
If the specified time for cron is 3:00 and halfRange is set to 5, then the random timing will be executed from 2:55 to 3:04, a total of 10 minutes.

This may seem counterintuitive, but it guarantees that there will be no time conflicts when halftime is set to 30 in an hourly cron.

We do not recommend expressing harfRange as a  floating-point number.

If the halfRange is longer than the cron interval, it may not be scheduled at the correct time.

For example, do not increase the halfRange to more than 15 minutes for a cron that runs every 30 minutes.

halfRange はランダム化される時間の範囲です。
cronの指定時間を3時、harfRangeを5を設定した時は2時55分から3時4分までの合計10分間の範囲からランダムなタイミング実行されます。

これはあまり直感的では無いように見えますが、1時間ごとのcronでhalftimeを30にしたとき時間がぶつからないことが保証されます。

harfRangeを小数で表すことは推奨していません。

cronの間隔よりharftimeを長くすると正しい時間にスケジュールされない可能性があります。

たとえば、30分おきに実行されるcronではhalfRangeを15分より多くしないでください。

### crons.type
enum       | description
--         | --
`'fixed'`  | Unrandomized, executed at a fixed time
`'normal'` | Randomized with equal probability within a range of time defined by `halfRange`
`'uniform'`| Randomized by normal distribution[^1] (but never beyond the range defined by `halfRange`)

[^1]: The normal distribution exceeds `halfRange` with a probability of 0.135% on one sided (0.27% on two sided).
