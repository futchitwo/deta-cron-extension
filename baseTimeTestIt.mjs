import { generateIterator, generateDoWIterator } from './lib/baseTime.js'

const cron = [
  ["00","*","?","*","1,L"],
  //['10','*','?','*','*'],
  //['10','0/8','?','*','*'],
  //['10','20','?','*','1,2'],
]

const now = new Date('Jan 8 2022 00:00:00');
for (let c of cron){
  console.log(c)
  
  const itr = generateIterator(c,now)
  console.log(itr.next())
  console.log(itr.next())
  console.log(itr.next())
  console.log(itr.next())
  console.log(itr.next())
  console.log(itr.next())

  console.log('\n')
}
