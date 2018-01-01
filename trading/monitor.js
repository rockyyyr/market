const { market, transaction } = require('../exchange')
const { time } = require('../util')

let running = false

function portfolio () {
  const interval = setInterval(async () => {
    const prices = await market.prices()
    const portfolio = transaction.getPortfolio()

    await check(portfolio, prices)

    if(portfolio.length === 0) {
      finished(interval)
    }

  }, time.seconds(30))
}

function check (portfolio, prices) {
  return new Promise(resolve => {
    let index = 0
    portfolio.forEach(investment => {
      const currency = get(investment.symbol, prices)

      if(currency.price >= investment.target || currency.price <= investment.abort) {
        const { pool, portfolio } = transaction.sell(investment, currency.price)
      }

      if(++index === portfolio.length) {
        resolve()
      }
    })
  })
}

function get (symbol, prices) {
  return prices.filter(item => item.symbol === symbol)[0]
}

function finished (interval) {
  console.log('shutting down monitor')
  running = false
  clearInterval(interval)
}

module.exports = {
  running,
  portfolio
}