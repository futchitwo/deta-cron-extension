import { setBaseHours } from './lib/baseTime.js'
const timezoneFix = 9 * 60 * 60 * 1000

const now = new Date()
console.log(now)

const timeArray = setBaseHours(['0,45','22,23'], now).flat()
console.log(timeArray)

const nowNum = now.getTime() + timezoneFix
console.log(new Date(nowNum))
const timeNums = timeArray.map(t => t.getTime() ).filter(t => nowNum < t ).map(t => new Date(t - timezoneFix))
console.log(timeNums)