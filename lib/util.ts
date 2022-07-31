export function dateToCron(date: Date) {
  const minute = date.getUTCMinutes();
  const hour = date.getUTCHours();
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  // const week = date.getUTCDay() + 1; //sussy AWS
  const year = date.getUTCFullYear();
  return `${minute} ${hour} ${day} ${month} ? ${year}`; 
}

export function isEmpty(obj: object) {
  return !Object.keys(obj).length;
}