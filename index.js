const { app } = require('deta');
const cron = require('./lib');

app.lib.cron(cron(
  event => {
    console.log("yey");
  }
));

module.exports = app;