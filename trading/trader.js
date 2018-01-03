const { investments, portfolio, stats, monitor } = require('./index')
const { market } = require('../exchange/index')
const { range, minutes, now } = require('../util/time')
const candlesticks = require('../prediction/candlesticks')

async function trade (strategy, lookback) {
  try {
    const top = await getTop(10, lookback)
    const currencies = mapCurrencies(top.data)

    // console.log(currencies)

    currencies.forEach(async currency => {
      const investment = investments.calculate(strategy, currency)

      if(portfolio.buyingEnabled()) {
        try {
          await portfolio.buy(investment)

          if(!monitor.isRunning()) {
            monitor.investments()
          }

        } catch(err) {
          console.log(err)
        }
      }
    })

  } catch(err) {
    console.error(err)
  }
}

async function getTop (size, lookback) {
  const prices = await market.history(range(now(), lookback))
  return stats.top(size, prices)
}

function get (symbol, prices) {
  return prices.filter(item => item.symbol === symbol)[0]
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