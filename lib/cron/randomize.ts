// randomized が startDate よりも早くなった時の処理

type randomizeType = 'fixed' | 'normal' | 'uniform';

export function randomizeDate(referenceDate: Date, type: randomizeType, halfRange = 0) {
  let randomNum = 0;
  if (type === 'fixed') {
    // nothing
  } else if (type === 'normal') {
    randomNum = rnormWithHalfRange(halfRange);
  } else if (type === 'uniform') {
    randomNum = Math.random() * 2 * halfRange - halfRange;
  } else {
    throw Error(`Cron type "${type}" is invalid`);
  }

  return new Date(referenceDate.getTime() + randomNum * 60 * 1000);
}

export function rnormWithHalfRange(halfRange: number) {
  // https://staff.aist.go.jp/t.ihara/normsdist.html
  // When the standard deviation is 1/3 of halfRange, the normal distribution exceeds halfRange with a probability of 0.135% on one sided (0.27% on two sided).
  const stdev = halfRange / 3;
  let result: number;
  do {
    result = rnorm() * stdev; 
  } while (result < -halfRange || halfRange <= result);
  return result;
}

// Reference: marketechlabo.com/normal-distribution-javascript
function rnorm() {
  return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
}

/*module.exports = {
  randomizeDate,
  rnormWithHalfRange,
};*/