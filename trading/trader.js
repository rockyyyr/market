const { investments, portfolio, stats, monitor } = require('./index')
const { market } = require('../exchange/index')
const { range, minutes, now } = require('../util/time')
const candlesticks = require('../prediction/candlesticks')

async function trade (strategy, lookback) {
  try {
    // const top = await getTop(10, lookback)
    // const currencies = mapCurrencies(top.data)

    const data = await candlestick(5, lookback)
    const currencies = mapCurrencies(data)
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

async function candlestick (size, lookback) {
  const data = await market.history(range(now(), lookback))
  const top = await stats.top(100, data)
  // console.log(JSON.stringify(top.data, null, 2))
  const filtered = top.data.filter(item => item.change < -5).map(item => item.symbol)
  const result = data.filter(item => filtered.includes(item.symbol))
  // console.log(JSON.stringify(result, null, 2))
  return candlesticks.analyze(size, result)
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