const { investments, portfolio, stats, monitor } = require('../trading')
const { range, minutes, now } = require('../util/time')
const { market } = require('../exchange/index')

async function trade (strategy, lookback, time) {
  try {
    const top = await getTop(10, lookback, time)
    const currencies = mapCurrencies(top.data)

    currencies.forEach(async currency => {
      const investment = investments.calculate(strategy, currency)

      if(portfolio.buyingEnabled()) {
        try {
          await portfolio.buy(investment)

        } catch(err) {
          console.log(err)
        }
      }
    })

    monitor.investments(time)

  } catch(err) {
    console.error(err)
  }
}

async function getTop (size, lookback, time) {
  const prices = await market.history(range(time, lookback))
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

module.exports = {
  trade
}