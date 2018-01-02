const { strategies } = require('../trading')
const { time, log } = require('../util')
const trader = require('./trader')

const fund = 0.01, profit = 0.0005
const lookback = 6

const strategy = strategies.oneToOne(fund, profit)
log.strategy(strategy)

const startTime = '2017-12-29T00:00:00-08:00'
let offset = 0

setInterval(() => {
  trader.trade(strategy, lookback, time.add(offset, 'hours', startTime))
  offset += 4

}, 100)
