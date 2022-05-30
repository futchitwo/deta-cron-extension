const { app } = require('deta');
const { cron } = require('./lib');

app.lib.cron(cron(
  event => {
    console.log("yey");
  }
));

app.lib.cron(cron(
  {
    settingsDBName: '',
    queueDBName: '',
    timezone: 0,
    crons:[
      {
        name: '',
        type: '',
        cron: '',
        halfRange: 0,
        function: (event) => {
          console.log('yey')
        },
      },
    ],
    defaultFunction: (event) => {
      console.log('yey')
    },
  },
))

module.exports = app;