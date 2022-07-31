
function rnormWithHalfRange(halfRange) {
  // https://staff.aist.go.jp/t.ihara/normsdist.html
  // When the standard deviation is 1/3 of halfRange, the normal distribution exceeds halfRange with a probability of 0.135% on one sided (0.27% on two sided).
  const stdev = halfRange / 3;
  let result;
  do {
    result = rnorm() * stdev; 
  } while (result < -halfRange || halfRange <= result);
  return result;
}

// Reference: marketechlabo.com/normal-distribution-javascript
function rnorm() {
  return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
}

const data = {
  "-6": 0,
  "-5": 0,
  "-4": 0,
  "-3": 0,
  "-2": 0,
  "-1": 0,
  "0": 0,
  "1": 0,
  "2": 0,
  "3": 0,
  "4": 0,
  "5": 0,
  "6": 0,
}

for (let i=0; i< 100000;i++){
  const n = rnormWithHalfRange(1);
  const m = Math.floor(n)//floor, trunc, round 
  data[m] ++;
}
console.log(JSON.stringify(data,null,2))

console.log(Math.trunc(-0.1),Math.trunc(0.1))