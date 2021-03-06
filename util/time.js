const moment = require('moment')

function now (){
  return moment().format()
}

function add(amount, timeframe, time = now()){
  return moment(time).add(amount, timeframe).format()
}

function minus (amount, timeframe) {
  return moment().subtract(amount, timeframe).format()
}

function minutes (minutes){
  return seconds(60) * minutes
}

function seconds (seconds){
  return 1000 * seconds
}

function range (current, lookback){
  return {
    start: moment(current).subtract(lookback + 3, 'hours').format(),
    current: current
  }
}

function rangeUnix(current, lookback){
  return {
    start: moment(current).subtract(lookback + 3, 'hours').unix(),
    current: moment(current).unix()
  }
}

module.exports = {
  now,
  add,
  minus,
  minutes,
  seconds,
  range,
  rangeUnix
}
