const { investments, strategies, stats, monitor } = require('./index')
const { range, minus, seconds, now } = require('../util/time')
const { market, transaction } = require('../exchange/index')
const log = require('../util/log')

const lookback = 6 //hours

const fund = 0.01
const profit = 0.0005
const strategy = strategies.oneToOne(fund, profit, transaction.fee)
log.strategy(strategy)

setInterval(async () => {
  try {
    const top = await getTop(10)

    const currencies = mapCurrencies(top.data)

    currencies.forEach(async currency => {
      const investment = investments.calculate(strategy, currency)

      if(transaction.buyingEnabled()) {
        try {
          await transaction.buy(investment)

          if(!monitor.running) {
            monitor.portfolio()
          }

        } catch(err) {
          console.log(err)
        }
      }
    })

  } catch(err) {
    console.error(err)
  }

}, 2000)

async function getTop (size) {
  const prices = await market.history(range(now(), lookback))
  return stats.top(size, prices)
}

function mapCurrencies (data) {
  return data.map(item => {
    return {
      symbol: item.symbol,
      price: item.currentPrice
    }
  })
}
