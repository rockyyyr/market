const strategies  = require('./strategies')
const trader = require('./trader')
const { time, log } = require('../util')

const fund = 0.01, profit = 0.0005
const lookback = 12

const strategy = strategies.oneToOne(fund, profit)
log.strategy(strategy)

setInterval(() => trader.trade(strategy, lookback), time.minutes(1))
