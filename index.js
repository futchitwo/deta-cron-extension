const { app } = require('deta');
const { cron } = require('./lib.js');

app.lib.cron(
  cron({
    settingsDBName: '', // option
    queueDBName: '', // option
    timezone: 0, // option, hour
    crons:[
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
      console.log(`default event! (eventname: ${event.randomcron.name}})`);
      
    },
  })
);

  module.exports = app;
