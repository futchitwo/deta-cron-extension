const fs = require('fs');
const fetch = typeof fetch === 'function' ? fetch : require('node-fetch');
const ENDPOINT = 'https://v1.deta.sh/schedules/';

function setRandomCron() {
  console.log('Setting random cron... ',new Date())
  const prog_info = fs.readFileSync('./.deta/prog_info');
  //console.log(prog_info)
  const microId = JSON.parse(prog_info).id;
  console.log(microId);
}

// todo get creon name from db[0]
function cron(fn) {
  return (event) => {
    if (event.type === "cron") {
      fn(event);
    } else {
      setRandomCron();
    }
  };
}
/*
別ファイルに分ける
function setCron(exp,ID) {
  fetch(ENDPOINT,{
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DETA_ACCESS_TOKEN}`,
    },
    body: JSON.stringfy({
      ProgramID: ID,
      Type: "cron",
      Expression: exp,
    }),
  })
}
*/
module.exports.default = cron;