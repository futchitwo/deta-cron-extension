# Deta Random Cron

## Note
This is alpha release, you can set cron only "minutes, hours, days of week".

## How To Use
1. Set an access token as environment variable on your Micro.
2. Install and setting this package to your Micro.
3. Deploy to Deta! 

## config
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
    crons:[
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

#### `halfRange`
#### `type`

enum | description
--|--
`'fixed'` | a
`'normal'` | 
`'uniform'`|
