const { app } = require('deta');
const { cron } = require('./lib.js');

app.lib.cron(
  cron({
    settingsDBName: 'deta-random-cron-cron-settings', // option
    queueDBName: 'deta-random-cron-cron-queue', // option
    timezone: 0, // option, hour
    schedule: [
      {
        name: 'exampleEvent',
        type: 'normal', // 'fixed' | 'normal' | 'uniform'
        cron: '15 * ? * * *',
        halfRange: 5, // minute this example is range of 10-19 minutes
        function: (event) => { // If omitted, executes the default function
          console.log('yey');
          return 'yeah';
        },
      },
    ],
    defaultFunction: (event) => { // option
      console.log(`default event! (eventname: ${event.extention.name}})`);
      
    },
  })
);

  module.exports = app;
