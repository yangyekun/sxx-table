// 根据汛期时间 判断正常还是汛限
// 江北： 6.15-9.15   江南：5.1-8.31 
export function getZCXXSW(nbfq) {
  let date = new Date(), year = date.getFullYear()
  let dateJb1 = new Date(year, 6 - 1, 15);
  let dateJb2 = new Date(year, 9 - 1, 15);
  let dateJn1 = new Date(year, 5 - 1, 1);
  let dateJn2 = new Date(year, 8 - 1, 31);

  if (nbfq == 1) {
    return date >= dateJb1 && date <= dateJb2 ? "汛限" : "正常"
  } else if (nbfq == 2) {
    return date >= dateJn1 && date <= dateJn2 ? "汛限" : "正常"
  } else {
    return date >= dateJb1 && date <= dateJn2 ? "汛限" : "正常"
  }
}

// 计算显示最大值最小值、间隔值
export function getInterval(maxMin, power, overZero) {
  // 次幂集合 10的N次幂
  power = power || [-2, -1, 0, 1, 2, 3, 4]
  // 极值，max min diff
  let { max = 0, min = 0, diff } = maxMin
  if(min > max){
    min = max = 0
  }
  if (diff == undefined) {
    diff = +max - +min
  }

  // 完善间隔库 
  //-2    0.01    0.02    0.05
  //-1    0.1     0.2     0.5
  //0     1       2       5
  //1     10      20      50
  //2     100     200     500
  //3     1000    2000    5000
  //4     10000   2000    5000
  let power_dafault = [-2, -1, 0, 1, 2, 3, 4]
  if (max == min) {
    if (max == 0) {
      return {
        max: null,
        min: null,
        interval: null
      }
    }
    if (power_dafault.join() === power.join()) {
      power = [0, 1, 2]
    }
  }

  let inteval_base = [1, 2, 5]
  let intevals = power.reduce((arr, item) => arr.concat(inteval_base.map(base => base * Math.pow(10, item))), [])

  let count = 4 //初定的等分数量
  let DY = diff / count //初定间隔
  max = max + 0.1 * DY //系列最大值
  min = min - 0.1 * DY //系列最小值

  // 强制在0之上
  if (overZero) {
    min = min < 0 ? 0 : min
  }

  // 坐标最大值 最小值 间隔值
  let MAX, MIN, Interval
  MIN = parseInt(min)
  //未完整考虑min为负数情况
  intevals.some((item, index) => {
    let _max = MIN + item * count
    if (_max > max) {
      Interval = intevals[(index == 0 ? 0 : index - 1)]
      MAX = MIN + Interval * count
      return true
    } else {
      Interval = item
      MAX = MIN + Interval * count
    }
  })

  MIN = parseInt(min / Interval) * Interval - (min < 0 ? Interval : 0)

  if (overZero) {
    MIN = MIN < 0 ? 0 : MIN //若系列值允许负数，不考虑此条件
  }

  MAX = MIN + Interval * count
  if (MAX < max) {
    count = count + (parseInt((max - MAX) / Interval) + 1)
    MAX = MIN + Interval * count
  }

  MAX = +MAX.toFixed(2)
  MIN = +MIN.toFixed(2)
  return {
    max: MAX,
    min: MIN,
    interval: Interval
  }
}

let memoryIntervals = {}
// 计算取间隔
export function getInterval1(maxMin) {
  let { max = 0, min = 0, diff } = maxMin
  let key = min + '-' + max + '-' + diff
  if(memoryIntervals[key])return memoryIntervals[key];

  if(min > max){
    min = max = 0
  }

  if (min == max) {
    if (min != Math.floor(min)) {
      min = Math.floor(min)
      max = Math.ceil(max)
    } else {
      if (min == 0) {
        max = 1
      } else {
        min = Math.max(0, min - 1)
        max += 1
      }
    }
  }
  if (diff == undefined) {
    diff = +max - +min
  }
  let intevals = [0.01, 0.02, 0.05]
  let count = 4, //初定的等分数量
    DY = diff / count, //分隔单位
    MAX = null, //坐标最大值
    MIN = null, //坐标最小值
    Interval = null //间隔值
  // 完善间隔库  0.01 - 10000   0.05 - 50000
  let range = 6, baseCount = intevals.length //加6级数据
  for (let index = 0; index < range; index++) {
    for (let index2 = 0; index2 < baseCount; index2++) {
      intevals.push(intevals[index2] * Math.pow(10, index + 1))
    }
  }
  max = max + 0.1 * DY //系列最大值
  min = min - 0.1 * DY //系列最小值

  min = min < 0 ? 0 : min
  MIN = parseInt(min)

  intevals.some((item, index) => {
    let _max = MIN + item * count
    if (_max > max) {
      Interval = intevals[(index == 0 ? 0 : index - 1)]
      MAX = MIN + Interval * count
      return true
    } else {
      Interval = item
      MAX = MIN + Interval * count
    }
  })

  MIN = parseInt(min / Interval) * Interval
  MIN = clearFloatNum(MIN)
  MIN = MIN < 0 ? 0 : MIN //若系列值允许负数，不考虑此条件
  MAX = MIN + Interval * count
  if (MAX < max) {
    count = count + (parseInt((max - MAX) / Interval) + 1)
    MAX = MIN + Interval * count
  }
  MAX = clearFloatNum(MAX)

  if(isNaN(MAX)){
    MAX = undefined
    Interval = undefined
  }
  if(isNaN(MIN)){
    MIN = undefined
    Interval = undefined
  }
  return memoryIntervals[key] = {
    max: MAX,
    min: MIN,
    interval: Interval
  }
}
function clearFloatNum(num) {
  let nums = (num + "").split('.')
  if (nums[1]) {
    let len = nums[1].length //5999
    let i1 = nums[1].indexOf('999')
    let i2 = nums[1].indexOf('000')
    if (i1 > -1) {
      return +Number(num).toFixed(i1)
    } else if (i2 > -1) {
      return +Number(num).toFixed(i2)
    }
  }
  return +num
}

export function calcMin(min, ...values){
  values.forEach(val => {
    if(!(val == null || val == '' || isNaN(min))){
      min = Math.min(min, val)
    }
  })
  return min
}
export function calcMax(max, ...values){
  values.forEach(val => {
    if(!(val == null || val == '' || isNaN(max))){
      max = Math.max(max, val)
    }
  })
  return max
}