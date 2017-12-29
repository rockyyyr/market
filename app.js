const { calculate, strategy, stats } = require('./tools')
const { market, transaction } = require('./exchange')
const { range, minus, minutes, seconds, now } = require('./util/time')
const log = require('./util/log')

const lookback = 3 //hours

const fund = 0.01
const profit = 0.0005

setInterval(async () => {
  try {
    const top = await getTop(1)
    const currency = mapCurrency(top.data[ 0 ])

    const investment = strategy.oneToOne(fund, profit, transaction.fee)
    const report = calculate.investment(investment, currency)

    log.investment(investment)
    log.table(report)
    transaction.buy(report)

  } catch(err) {
    console.error(err)
    process.exit(0)
  }

}, seconds(2))

async function getTop (size) {
  const prices = await market.history(range(minus(10), lookback))
  return stats.top(size, prices)
}

function mapCurrency (data) {
  return {
    symbol: data.symbol,
    price: data.currentPrice
  }
}
