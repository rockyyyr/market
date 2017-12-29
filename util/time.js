const moment = require('moment')

function now (){
  return moment().format()
}

function minus (days) {
  return moment().subtract(days, 'days').format()
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

module.exports = {
  now,
  minus,
  minutes,
  seconds,
  range
}
