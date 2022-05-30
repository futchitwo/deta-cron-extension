export function dateToCron(date: Date){
  // use "?"
  const minute = date.getUTCMinutes();
  const hour = date.getUTCHours();
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  // const week = date.getUTCDay() + 1; //sussy AWS
  const year = date.getUTCFullYear();
  return `${minute} ${hour} ${day} ${month} ? ${year}`; 
}
/*
const intervalNum = {
  everyhour: 1,
  everyday: 2,
  everymonth: 3,
  everyweek: 4,
  everyyear: 5,
}
*/

/*module.exports = {
  dateToCron,
};*/