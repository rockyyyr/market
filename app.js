const { calculate, Strategy, stats, monitor } = require('./tools')
const { market, transaction } = require('./exchange')
const { range, minus, seconds } = require('./util/time')
const log = require('./util/log')

const lookback = 3 //hours

const fund = 0.01
const profit = 0.0005

setInterval(async () => {
  try {
    const top = await getTop(1)

    const currency = mapCurrency(top.data[0])
    const strategy = Strategy.oneToOne(fund, profit, transaction.fee)
    const investment = calculate.investment(strategy, currency)

    log.investment(strategy)
    log.table(investment)

    if(transaction.buying) {
      try {
        const { pool, portfolio } = await transaction.buy(investment)

        if(!monitor.running)
          monitor.portfolio()

        console.log(`pool: ${pool}`)
        console.log(JSON.stringify(portfolio))

      } catch(err) {
        console.log(err)
      }
    }


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
